const { BrowserWindow, app, ipcMain, Notification, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');

  ipcMain.on('fileDialog', async() => {
    const filename = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'ファイルを選択しよう'
    });
    const filepath = filename.filePaths[0];
    console.log(filepath);
    win.webContents.send('filename',filepath);
    fs.readdir(filepath, (err, files) => {
      console.log(files);
      files.shift();
      win.webContents.send('allFiles',files);
    })
  });
}

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  });
}

//ipcRenderer.sendによりチャンネルnotifyに送られてきた引数messageをお知らせ表示する
ipcMain.on('notify', (_, message) => {
  new Notification({ title: 'Notification', body: message }).show();
});


app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
