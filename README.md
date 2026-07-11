# QuickUtils

A lightweight PWA for common utilities that LLM assistants can't do.

- 🪙 **Coin Flip** — tap to flip, animated result
- 🎲 **Dice Roller** — d4 through d20, 1–6 dice
- 🔢 **Random Number** — pick a range, get a number
- 🔑 **Password Generator** — configurable length and character sets

## Features

- Installable as a PWA on Android and iOS
- Works offline
- Respects system light/dark mode
- No tracking, no analytics, no server

## Development

Open `index.html` in a browser. No build step needed.

For local development with a proper service worker, serve with any static file server:

```bash
npx serve .
```

## Deployment

Push to GitHub and enable GitHub Pages from the `main` branch root.
