
const API_URL = "https://basicgamedeplyweb-production.up.railway.app"; 


// canva fondo

const bg    = document.getElementById("bg");
const bgCtx = bg.getContext("2d");
bg.width  = window.innerWidth;
bg.height = window.innerHeight;
window.addEventListener("resize", () => { bg.width = window.innerWidth; bg.height = window.innerHeight; });

// juego canva

const canvas = document.getElementById("canvas");
const ctx    = canvas.getContext("2d");


// nombre del player

let playerName = localStorage.getItem("playerName") || null;

function showNameScreen() {
    document.getElementById("name-overlay").style.display = "flex";
    setTimeout(() => document.getElementById("name-input").focus(), 50);
}
function hideNameScreen() {
    document.getElementById("name-overlay").style.display = "none";
}

document.getElementById("name-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = document.getElementById("name-input").value.trim();
    if (!val) return;
    playerName = val.slice(0, 16);
    localStorage.setItem("playerName", playerName);
    hideNameScreen();
    startGame();
});


// leaderboard

let globalLeaderboard = [];

async function fetchLeaderboard() {
    try {
        const res  = await fetch(`${API_URL}/scores`);
        globalLeaderboard = await res.json();
    } catch (err) {
        console.log("ERROR", err)
    }
}

async function submitScore(name, score) {
    try {
        await fetch(`${API_URL}/scores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, score })
        });
        await fetchLeaderboard();
    } catch (err) {"ERROR", err}
}

fetchLeaderboard();
setInterval(fetchLeaderboard, 10000);

// ─── dimensiones del leaderboard (para excluir del grid) ───
const LB_X = 30, LB_Y = 30, LB_W = 200, LB_H = 215;

function drawLeaderboardBG() {
    const x = LB_X, y = LB_Y, w = LB_W, h = LB_H;

    const grad = bgCtx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, "rgba(10,0,30,0.93)");
    grad.addColorStop(1, "rgba(0,0,15,0.93)");
    bgCtx.fillStyle = grad;
    bgCtx.beginPath(); bgCtx.roundRect(x, y, w, h, 8); bgCtx.fill();

    bgCtx.strokeStyle = "#ff00ff"; bgCtx.lineWidth = 1.5;
    bgCtx.shadowColor = "#ff00ff"; bgCtx.shadowBlur = 8;
    bgCtx.beginPath(); bgCtx.roundRect(x, y, w, h, 8); bgCtx.stroke();

    bgCtx.strokeStyle = "rgba(255,0,255,0.3)"; bgCtx.lineWidth = 1; bgCtx.shadowBlur = 0;
    bgCtx.beginPath(); bgCtx.moveTo(x+10, y+32); bgCtx.lineTo(x+w-10, y+32); bgCtx.stroke();

    bgCtx.shadowColor = "#ff00ff"; bgCtx.shadowBlur = 6;
    bgCtx.fillStyle = "#ff00ff";
    bgCtx.font = "bold 12px 'Courier New', monospace";
    bgCtx.fillText("🌐 GLOBAL TOP 5", x + 14, y + 22);

    for (let i = 0; i < 5; i++) {
        const ey    = y + 55 + i * 30;
        const entry = globalLeaderboard[i];
        const name  = entry ? entry.name.slice(0, 11) : "---";
        const score = entry ? entry.score + "s" : "";

        if (i === 0 && entry) {
            bgCtx.fillStyle = "rgba(255,0,255,0.1)";
            bgCtx.beginPath(); bgCtx.roundRect(x+8, ey-16, w-16, 22, 4); bgCtx.fill();
        }
        bgCtx.shadowBlur  = i === 0 ? 5 : 0;
        bgCtx.fillStyle   = i === 0 ? "#fff" : "rgba(200,180,220,0.8)";
        bgCtx.font        = i === 0 ? "bold 12px 'Courier New', monospace" : "12px 'Courier New', monospace";
        bgCtx.fillText(`${i+1}.`, x+14, ey);
        bgCtx.fillText(name, x+34, ey);
        bgCtx.fillStyle = i === 0 ? "#ff88ff" : "rgba(200,160,220,0.9)";
        bgCtx.fillText(score, x + w - 38, ey);
    }

    if (playerName) {
        bgCtx.shadowBlur = 0;
        bgCtx.fillStyle  = "rgba(0,207,255,0.75)";
        bgCtx.font       = "11px 'Courier New', monospace";
        bgCtx.fillText(`Jugador: ${playerName}`, x + 14, y + h - 10);
    }
    bgCtx.shadowBlur = 0;
}


// lineas moradas grind

function getExclusionZones() {
    const rect = canvas.getBoundingClientRect();
    return [
        { x1: rect.left, y1: rect.top,  x2: rect.right, y2: rect.bottom },
        { x1: LB_X-5,    y1: LB_Y-5,   x2: LB_X+LB_W+5, y2: LB_Y+LB_H+5 }
    ];
}

function drawBackground() {
    bgCtx.fillStyle = "black";
    bgCtx.fillRect(0, 0, bg.width, bg.height);

    const zones    = getExclusionZones();
    const gameZone = zones[0], lbZone = zones[1];
    const W = bg.width, H = bg.height;
    const horizon  = H * 0.5;
    const vp       = { x: W / 2, y: horizon };

    bgCtx.save();
    bgCtx.beginPath();
    bgCtx.rect(0, 0, W, H);
    bgCtx.rect(gameZone.x2, gameZone.y1, gameZone.x1 - gameZone.x2, gameZone.y2 - gameZone.y1);
    bgCtx.rect(lbZone.x2,   lbZone.y1,   lbZone.x1  - lbZone.x2,   lbZone.y2   - lbZone.y1);
    bgCtx.clip("evenodd");

    bgCtx.strokeStyle = "#ff00ff";
    bgCtx.lineWidth   = 1;
    bgCtx.shadowColor = "#ff00ff";
    bgCtx.shadowBlur  = 6;

    // horizontales retrowave (suelo + techo)
    const numH = 32;
    for (let i = 0; i < numH; i++) {
        const t     = i / (numH - 1);
        const yDown = horizon + (H - horizon) * (t * t);
        const yUp   = horizon - horizon * (t * t);
        bgCtx.globalAlpha = 0.22 + 0.78 * t;
        bgCtx.beginPath(); bgCtx.moveTo(0, yDown); bgCtx.lineTo(W, yDown); bgCtx.stroke();
        bgCtx.beginPath(); bgCtx.moveTo(0, yUp);   bgCtx.lineTo(W, yUp);   bgCtx.stroke();
    }

    bgCtx.globalAlpha = 1;

    // verticales densas — convergen al punto de fuga
    const numV = 60;
    for (let i = 0; i <= numV; i++) {
        const xEdge = (i / numV) * W;
        const dist  = Math.abs(xEdge - W / 2) / (W / 2);
        bgCtx.globalAlpha = 0.12 + 0.88 * dist;
        bgCtx.beginPath(); bgCtx.moveTo(xEdge, H);   bgCtx.lineTo(vp.x, vp.y); bgCtx.stroke();
        bgCtx.beginPath(); bgCtx.moveTo(xEdge, 0);   bgCtx.lineTo(vp.x, vp.y); bgCtx.stroke();
    }

    bgCtx.globalAlpha = 1;
    bgCtx.shadowBlur  = 0;
    bgCtx.restore();

    drawLeaderboardBG();
    requestAnimationFrame(drawBackground);
}


// game

const PlayerSize  = 30;
let playerX = canvas.width / 2 - PlayerSize / 2;
let playerY = canvas.height / 2 - PlayerSize / 2;

const keys = {};
const speed = 15;
const numEnemigos = 15;
const enemies = [];
const enemiesSize = 5;
let velenemies = 2;
let gameover   = false;
let startTime  = Date.now();
let record     = 0;
let pauseStart = 0;
let scoreSubmitted = false;

document.addEventListener("keydown", (e) => { if (e.key.startsWith("Arrow")) e.preventDefault(); keys[e.key] = true; });
document.addEventListener("keyup",   (e) => { keys[e.key] = false; });
document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseStart = Date.now();
    else startTime += Date.now() - pauseStart;
});

function normalize(x, y) {
    const m = Math.sqrt(x*x + y*y);
    return m === 0 ? { x:0, y:0 } : { x: x/m, y: y/m };
}
function collision(ax, ay, as, bx, by, bs) {
    return ax < bx+bs && ax+as > bx && ay < by+bs && ay+as > by;
}

function initEnemies() {
    for (let i = 0; i < numEnemigos; i++) {
        const d = normalize(Math.random()*2-1, Math.random()*2-1);
        enemies[i] = { x: Math.random()*canvas.width, y: Math.random()*canvas.height, dx: d.x, dy: d.y };
    }
}

function startGame() {
    gameover       = false;
    scoreSubmitted = false;
    startTime      = Date.now();
    record         = 0;
    playerX        = canvas.width  / 2 - PlayerSize / 2;
    playerY        = canvas.height / 2 - PlayerSize / 2;
    initEnemies();
    requestAnimationFrame(gameloop);
}

function gameloop() {
    const currentTime = (Date.now() - startTime) / 1000;
    if (!gameover && currentTime > record) record = currentTime;
    velenemies = Math.min(5 + currentTime * 0.5, 6);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameover) {
        if (!scoreSubmitted) { scoreSubmitted = true; submitScore(playerName, Math.floor(record)); }

        ctx.font = "bold 40px 'Courier New', monospace";
        ctx.fillStyle = "red"; ctx.shadowColor = "red"; ctx.shadowBlur = 15;
        ctx.fillText("Fallas\nTe\nPuta", canvas.width/2 - 105, canvas.height/2 - 20);

        ctx.font = "24px 'Courier New', monospace";
        ctx.fillStyle = "#00cfff"; ctx.shadowColor = "#00cfff"; ctx.shadowBlur = 10;
        ctx.fillText("Score: " + Math.floor(record) + "s", canvas.width/2 - 65, canvas.height/2 + 30);

        ctx.font = "16px 'Courier New', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.shadowBlur = 0;
        ctx.fillText("Presiona R para reiniciar", canvas.width/2 - 105, canvas.height/2 + 65);

        if (keys["r"] || keys["R"]) {
            gameover = false; scoreSubmitted = false;
            startTime = Date.now();
            playerX = canvas.width/2 - PlayerSize/2;
            playerY = canvas.height/2 - PlayerSize/2;
            initEnemies();
        }

    } else {
        ctx.fillStyle = "#00ff88"; ctx.shadowColor = "#00ff88"; ctx.shadowBlur = 12;
        ctx.fillRect(playerX, playerY, PlayerSize, PlayerSize);
        ctx.shadowBlur = 0;

        if (keys["ArrowLeft"])  playerX -= speed;
        if (keys["ArrowRight"]) playerX += speed;
        if (keys["ArrowDown"])  playerY += speed;
        if (keys["ArrowUp"])    playerY -= speed;
        playerX = Math.max(0, Math.min(canvas.width  - PlayerSize, playerX));
        playerY = Math.max(0, Math.min(canvas.height - PlayerSize, playerY));

        for (let i = 0; i < numEnemigos; i++) {
            for (let j = i+1; j < numEnemigos; j++) {
                if (collision(enemies[i].x, enemies[i].y, enemiesSize, enemies[j].x, enemies[j].y, enemiesSize)) {
                    const dx = enemies[i].x - enemies[j].x, dy = enemies[i].y - enemies[j].y;
                    const n  = normalize(dx, dy);
                    enemies[i].dx =  n.x; enemies[i].dy =  n.y;
                    enemies[j].dx = -n.x; enemies[j].dy = -n.y;
                }
            }
            enemies[i].x += enemies[i].dx * velenemies;
            enemies[i].y += enemies[i].dy * velenemies;
            if (enemies[i].x <= 0 || enemies[i].x >= canvas.width  - enemiesSize) enemies[i].dx *= -1;
            if (enemies[i].y <= 0 || enemies[i].y >= canvas.height - enemiesSize) enemies[i].dy *= -1;

            ctx.fillStyle = "#ff3333"; ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 8;
            ctx.fillRect(enemies[i].x, enemies[i].y, enemiesSize, enemiesSize);
            ctx.shadowBlur = 0;

            if (collision(playerX, playerY, PlayerSize, enemies[i].x, enemies[i].y, enemiesSize)) {
                gameover = true;
            }
        }

        ctx.fillStyle = "white"; ctx.font = "18px 'Courier New', monospace"; ctx.shadowBlur = 0;
        ctx.fillText("Tiempo: " + Math.floor(currentTime) + "s", 12, 24);
        ctx.fillStyle = "#00cfff";
        ctx.fillText("Record: " + Math.floor(record) + "s", 12, 48);
    }
    requestAnimationFrame(gameloop);
}

// ── arrancar ──
drawBackground();
if (!playerName) showNameScreen();
else startGame();