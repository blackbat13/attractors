const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopPrinter', {
  printCanvas: (dataUrl) => ipcRenderer.invoke('printer:printCanvas', dataUrl)
});
