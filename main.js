const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // هذه السطر مهم جدًا لتحميل ملفات الواجهة من مجلد out
  win.loadFile(path.join(__dirname, 'out/index.html'));

  // اختياري: لعرض الأخطاء في DevTools
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
