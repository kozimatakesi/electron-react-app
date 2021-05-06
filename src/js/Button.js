import React from 'react';

export default function Button() {

  api.on('filename', (event, arg) => document.body.insertAdjacentHTML('beforebegin', arg));
  api.on('allFiles', (event, arg) => document.body.insertAdjacentHTML('afterend', arg));

  return (
    <div>
      <h1>I am App Component!!!!</h1>
      <button onClick={() => {
        api.notificationApi.sendNotification('My custom notification!')
      }}>Notify</button>
      <button onClick={() => {
        api.filesApi.openFile()
      }}>ファイル検索</button>
    </div>
  )
}