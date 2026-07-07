# DoodlePitch
A delightfully messy, sketch-style fantasy football companion that hides a monster optimization engine. Built in Python with a hand-drawn comic aesthetic, it uses integer linear programming algorithms to solve the mathematical Knapsack Problem, generating optimal player transfers, captain choices, and squad arrangements under budget constraints.

<img width="1043" height="267" alt="background-removed (5)" src="https://github.com/user-attachments/assets/57a4ea4b-76b8-4c7e-9188-782e99d41559" />
<h1 align="center">⚽ DoodlePitch</h1>
<p align="center"><i>the hand-drawn fantasy football solver</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/-YNWA-C8102E?style=flat-square" />
  <img src="https://img.shields.io/badge/Python-6C9EFF?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/PuLP-A1E3AD?style=flat-square" />
  <img src="https://img.shields.io/badge/CBC%20Solver-FFD166?style=flat-square" />
  <img src="https://img.shields.io/badge/Vanilla%20JS-FF79B4?style=flat-square" />
</p>

<p align="center">
I'm a huge Liverpool fan, and like every FPL manager I've spent way too many hours agonizing over who to bench. So I built a notebook that does the maths for me.
</p>

---

### what it is

A budget, a player pool, and a squad shape go in. An optimal XI comes out — solved with real Mixed-Integer Linear Programming, not vibes.

```
  player pool  →  MILP solver (PuLP + CBC)  →  optimal XI
  £ budget         maximize Σ score·x           on the chalkboard
  lock / ban       subject to constraints
```


<img width="1680" height="1050" alt="image" src="https://github.com/user-attachments/assets/b7eda21b-c27a-4377-89c4-8274c1cb0654" />




### the maths, briefly

```
Every player gets a score, blending season points with current form based on how much you trust the recent run of games.
The solver then picks the combination of players that adds up to the highest total score, without ever going over budget.

Locked players are forced into the squad. Banned players are forced out. And whichever squad mode you pick — Knapsack,
FPL, or 5-a-side — adds its own shape rules on top (how many defenders, midfielders, forwards, and exactly one keeper).

It's the knapsack problem, wearing a Liverpool shirt.
```

### squad modes

| mode | rule |
|---|---|
| 🎒 Knapsack | ≤ 11 players, budget only |
| 🏆 FPL Squad | 11 players — 1 GK, 3–5 DEF, 3–5 MID, 1–3 FWD |
| ✋ 5-a-side | 5 players — 1 GK + 1 DEF/MID/FWD min |

### stack

**Backend** — Python · Pandas · PuLP · CBC solver

**Frontend** — vanilla JS · SVG · localStorage

**Design** — sketchy notebook UI, felt-tip borders, chalkboard pitch

### run it

```bash
python server.py
```

---

<p align="center"><sub>drawn in the margins, solved underneath</sub></p>
