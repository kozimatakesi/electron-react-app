import React from 'react';

export default function Button() {

  return (

    <div>
      <h1>I am App Component!!!!</h1>
      <button onClick={() => {
        electron.notificationApi.sendNotification('My custom notification!')
      }}>Notify</button>
      <button onClick={() => {
        electron.filesApi.openFile()
      }}>ファイル検索</button>
      {electron.on('filename', (event, arg) => {
        document.body.insertAdjacentHTML('afterend', arg);
      })}
    </div>
  )
}