const { BrowserWindow, app, ipcMain, Notification, dialog, Menu } = require('electron');
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
  //menu追記


    //Menuバーの作成
  const isMac = process.platform === 'darwin'

  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'ファイル',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' },
        { label: 'open' ,
          accelerator: 'Command+0',
          click: async() => {
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
          }
        }
      ]
    },
    // { role: 'editMenu' }
    {
      label: '編集',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: '見かけ',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)


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