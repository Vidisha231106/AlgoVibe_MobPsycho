# AlgoVibe — Psychic Energy Simulator

Simple, educational React app that simulates "psychic energy" accumulation and explosions (inspired by Mob Psycho 100). The project demonstrates interactive UI, animations, and visual effects (WebGL lightning shader + canvas effects).

The core DSA concept is Prefix Sum (cumulative sums of energy changes), with cyclic resets when energy hits the threshold (e.g., 100%).

## Features
- Multi-page React app (Home, Intro, Simulation) using React Router
- Live step-by-step simulation of energy events with a running prefix-sum history
- Explosion detection (energy threshold) with particle/flash feedback
- Visual backgrounds: Global WebGL `Lightning` shader (full-viewport) — configurable via props
- Accessibility considerations: respects `prefers-reduced-motion` and uses non-interactive decorative elements (pointer-events: none, aria-hidden)
