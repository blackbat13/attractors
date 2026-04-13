# Attractors - Chaos Theory

This project now runs as a standalone desktop application using Electron.

## Requirements

- Node.js 18+
- npm

## Install dependencies

```bash
npm install
```

## Run desktop app

```bash
npm start
```

## Printing workflow

1. Set `PRINTER_TOOL_EXE_PATH` in `main.js` to your command-line `.exe` path.
2. Open any attractor page in the desktop app.
3. Click **Print**.

The app will:

- Export the current canvas to a PNG file in your system temporary directory.
- Execute your configured `.exe` and pass the PNG path as the first command-line argument.

## Build Windows installer

```bash
npm run build
```

The generated installer will be created in the `dist/` folder.