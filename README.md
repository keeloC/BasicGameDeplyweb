# EsoTilinjuego – Survival Grid

Juego arcade estilo survival donde debes esquivar enemigos el mayor tiempo posible en un entorno con estética *retrowave*.

---

## si quieres jugar ahora aca el link

Link: https://keeloc.github.io/BasicGameDeplyweb/

---

##  Descripción

*BasicGame es un juego en tiempo real donde controlas un jugador dentro de un canvas y debes sobrevivir mientras múltiples enemigos se mueven por el mapa.

A medida que pasa el tiempo:

*  El juego se vuelve más difícil
*  Los enemigos aumentan su velocidad
*  Tu objetivo es resistir lo máximo posible

---

##  Controles

* ⬅️ ➡️ ⬆️ ⬇️ → Movimiento del jugador
* R → Reiniciar partida (cuando pierdes)

---

##  Sistema de puntuación

* Tu puntuación se basa en el **tiempo sobrevivido**
* Se guarda automáticamente en un **leaderboard global**
* Solo se registra tu mejor puntuación

---

##  Leaderboard online

El juego está conectado a un backend hecho con:

*  FastAPI
*  Railway

Esto permite:

* Guardar puntuaciones globales
* Ver rankings en tiempo real
* Competir con otros jugadores

---

##  Características

* Fondo animado estilo **grid 3D infinito**
* Sistema de colisiones con física básica
* Velocidad progresiva de enemigos
* Pausa automática al cambiar de pestaña
* Interfaz minimalista estilo neón

---

##  Tecnologías usadas

* JavaScript (Canvas API)
* HTML + CSS
* FastAPI (backend)
* SQLite (base de datos)
* Railway (deploy backend)
* GitHub Pages (deploy frontend)

---

##  Estructura del proyecto

```
Thegame/
 ├── index.html
 ├── style.css
 ├── main.js

backend/
 ├── main.py
 ├── requirements.txt
 ├── railway.toml
```

---

##  Notas

* El leaderboard requiere conexión a internet
* Si el backend está caído, el juego sigue funcionando pero sin guardar scores

---

##  Autor

Desarrollado por Keelo Arc

---

##  Futuras mejoras

* Sistema de cuentas / login
* Anti-trampas
* Power-ups
* Diferentes niveles
* Multiplayer online

---

 Proyecto creado como práctica de desarrollo de videojuegos web + backend real.
