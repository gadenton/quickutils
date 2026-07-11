# QuickUtils

A lightweight PWA for common utilities that LLM assistants can't easily perform.

## Available Tools

- 🔑 **Password Generator** — Configurable length (8–64 characters) and character sets (uppercase, lowercase, numbers, symbols), with one-tap copy.
- 🎲 **Dice Roller** — Supports standard RPG dice (d4, d6, d8, d10, d12, d20) with configurable counts (1–6 dice).
- 🪙 **Coin Flip** — Interactive animated coin flip with persistent session and lifetime stats.
- 🔢 **Random Number** — Generate random integers within a customizable min/max range.
- 🎯 **Picker & Elimination** — Input options to either pick one at random or systematically eliminate options in a turn-based multiplayer elimination game.

## Features

- **PWA Capabilities**: Installable on Android, iOS, and desktop browsers with custom installation prompts.
- **Offline First**: Runs completely offline using a local Service Worker cache.
- **Dynamic Styling**: Respects system light/dark modes with CSS color-scheme adjustments.
- **Privacy Oriented**: Runs 100% in the client. No analytics, tracking, cookies, or external server calls.

## Development

Open `index.html` in any browser. No compilation or build steps are required.

To run locally with Service Worker caching enabled, serve the root directory with a local HTTP server:

```bash
npx serve .
```

### Git Hooks Setup

To automatically bump the Service Worker cache version on every commit, enable the repository's git hooks:

```bash
git config core.hooksPath .githooks
```

## Deployment

Push to GitHub and enable GitHub Pages pointing to the root of the `main` branch.
