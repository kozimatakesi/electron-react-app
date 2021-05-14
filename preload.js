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
    openFile() {
      ipcRenderer.send('fileDialog');
    },

    openFileTwo() {
      ipcRenderer.send('fileDialogTwo');
    },

    copyFile(arg) {
      ipcRenderer.send('filecopy', arg)
    }
  },
});
