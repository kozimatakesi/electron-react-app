const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send('notify', message);
    },
  },

  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, arg) => callback(event, arg));
  },

  filesApi: {
    searchOriginalDir() {
      ipcRenderer.send('searchOriginalDir');
    },

    searchCopyToDir() {
      ipcRenderer.send('searchCopyToDir');
    },

    copyFile(pathInfo) {
      ipcRenderer.send('filecopy', pathInfo)
    }
  },
});
