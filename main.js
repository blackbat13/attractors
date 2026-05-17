const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const { execFile } = require('child_process');
const path = require('path');

// Set your command-line print executable here.
const PRINTER_TOOL_EXE_PATH = 'TiMini-Print-Command-Line-Windows-x86_64.exe';
const PRINTER_BLUETOOTH_DEVICE = 'X5h-30D0';

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#0b0b0b',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

ipcMain.handle('printer:printCanvas', async (_event, dataUrl) => {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return { ok: false, message: 'Invalid canvas content.' };
  }

  if (!PRINTER_TOOL_EXE_PATH) {
    return { ok: false, message: 'Printer executable is not configured. Set PRINTER_TOOL_EXE_PATH in main.js.' };
  }

  if (!fs.existsSync(PRINTER_TOOL_EXE_PATH)) {
    return { ok: false, message: 'Configured executable path does not exist: ' + PRINTER_TOOL_EXE_PATH };
  }

  const matches = dataUrl.match(/^data:image\/png;base64,(.+)$/);
  if (!matches || matches.length < 2) {
    return { ok: false, message: 'Only PNG canvas export is supported.' };
  }

  const fileName = `attractor-${Date.now()}.png`;
  const filePath = path.join(app.getPath('temp'), fileName);

  try {
    fs.writeFileSync(filePath, Buffer.from(matches[1], 'base64'));
  } catch (error) {
    return { ok: false, message: 'Failed to save exported image: ' + error.message };
  }

  return new Promise((resolve) => {
    execFile(PRINTER_TOOL_EXE_PATH, [filePath, '--bluetooth', PRINTER_BLUETOOTH_DEVICE], (error) => {
      if (error) {
        resolve({ ok: false, message: 'Failed to execute printer tool: ' + error.message, filePath });
        return;
      }

      resolve({ ok: true, filePath, executablePath: PRINTER_TOOL_EXE_PATH });
    });
  });
});

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
