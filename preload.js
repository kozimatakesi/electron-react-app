const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send("notify", message);
    },
  },

  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, arg) => callback(event, arg));
  },

  filesApi: {
    searchOriginalDir() {
      ipcRenderer.send("searchOriginalDir");
    },

    searchCopyToDir() {
      ipcRenderer.send("searchCopyToDir");
    },

    searchXlsxFile() {
      ipcRenderer.send("searchXlsxFile");
    },

    copyFile(pathInfo) {
      ipcRenderer.send("filecopy", pathInfo);
    },

    xlsxOutput(pathInfo) {
      ipcRenderer.send("xlsxOutput", pathInfo);
    },

    xlsxLoad(pathInfo) {
      ipcRenderer.send("xlsxLoad", pathInfo);
    },
  },
});
