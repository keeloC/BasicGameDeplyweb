from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3, os

app = FastAPI()

# ── CORS: permite peticiones desde GitHub Pages o cualquier origen ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

DB_PATH = "leaderboard.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS scores (
            id    INTEGER PRIMARY KEY AUTOINCREMENT,
            name  TEXT    NOT NULL,
            score INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

# ── Modelos ──
class ScoreIn(BaseModel):
    name:  str
    score: int

class ScoreOut(BaseModel):
    name:  str
    score: int

# ── Endpoints ──
@app.get("/scores", response_model=list[ScoreOut])
def get_scores():
    """Devuelve el top 10 global (mejor score por jugador)."""
    conn = get_db()
    rows = conn.execute("""
        SELECT name, MAX(score) AS score
        FROM scores
        GROUP BY LOWER(name)
        ORDER BY score DESC
        LIMIT 10
    """).fetchall()
    conn.close()
    return [{"name": r["name"], "score": r["score"]} for r in rows]

@app.post("/scores", response_model=ScoreOut)
def post_score(data: ScoreIn):
    """Guarda un nuevo score."""
    name  = data.name.strip()[:16]
    score = data.score

    if not name:
        raise HTTPException(status_code=400, detail="Nombre requerido")
    if score < 0 or score > 3600:
        raise HTTPException(status_code=400, detail="Score inválido")

    conn = get_db()
    conn.execute("INSERT INTO scores (name, score) VALUES (?, ?)", (name, score))
    conn.commit()
    conn.close()
    return {"name": name, "score": score}

@app.get("/")
def root():
    return {"status": "ok", "game": "TheGame Leaderboard API"}
