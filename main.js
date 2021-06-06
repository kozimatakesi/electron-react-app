const {
  BrowserWindow,
  app,
  ipcMain,
  Notification,
  dialog,
  Menu,
} = require("electron");
const path = require("path");
const fs = require("fs").promises;

const isDev = !app.isPackaged;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 400,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
};

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

//ipcRenderer.sendによりチャンネルnotifyに送られてきた引数messageをお知らせ表示する
ipcMain.on("notify", (_, message) => {
  new Notification({ title: "Notification", body: message }).show();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//ファイルをコピーする
ipcMain.on("filecopy", (_, pathInfo) => {

  //勝手にファイルをコピーしたら危険なのでコメントアウト
  /* pathInfo.files.forEach(file => {
    fs.copyFile(`${pathInfo.original}/${file}`, `${pathInfo.copyTo}/${file}`,(err) => {
      if(err) throw err;
    })
  }); */

  new Notification({
    title: `コピー完了`,
    body: `${pathInfo.mkdir}に${pathInfo.files}をコピーしました`,
  }).show();
});

//送信先フォルダを指定するためのダイアログを開く
ipcMain.on("searchCopyToDir", async (event) => {
  const dirInfo = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    title: "title",
  });
  const dirPath = dirInfo.filePaths[0];
  event.reply("copyToDirPath", dirPath);
});

//ファイル検索ボタンが押されたら
ipcMain.on("searchOriginalDir", (event) => {
  dispDialog(event);
});

//ダイアログを表示して、選択したフォルダのパスと中身のファイル全てのファイル名、ファイルサイズ、更新日時をレンダラーに返して表示する関数
const dispDialog = async (event) => {
  try {
    const dirInfo = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "ディレクトリを選択しよう",
    });
    const dirPath = dirInfo.filePaths[0];
    event.reply("originalDirPath", dirPath);
    const filesInfoArray = [];
    const allFilesName = await fs.readdir(dirPath, 'utf-8');
    for(let i = 0; i < allFilesName.length; i++){
      const stats = await fs.stat(`${dirPath}/${allFilesName[i]}`, 'utf-8');
      filesInfoArray.push({name:allFilesName[i], stats:stats});
    }
    event.reply('allFilesInfo', filesInfoArray);
  } catch (err) {
    console.log(err);
  }
}

//Menuバーの作成
const isMac = process.platform === "darwin";

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "ファイル",
    submenu: [
      isMac ? { role: "close" } : { role: "quit" },
      {
        label: "open",
        accelerator: "Command+0",
        click: () => {},
      },
    ],
  },
  // { role: 'editMenu' }
  {
    label: "編集",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "見かけ",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://electronjs.org");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
