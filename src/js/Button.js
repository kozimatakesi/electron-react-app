import React, { useState } from "react";

const Button = () => {
  const [mkdirPath, setMkdirPath] = useState('コピー先ファイルパス');
  const [originaldirPath, setOriginaldirPath] = useState('コピー元ファイルパス');

  const handleInputChangedMkdir = (event) => {
    const inputValue = event.target.value;
    setMkdirPath(inputValue);
  }

  const handleInputChangedOriginal = (event) => {
    const inputValue = event.target.value;
    setOriginaldirPath(inputValue);
  }

  api.on(
    "filename",
    (event, arg) => (setOriginaldirPath(arg))
  );

  api.on(
    "filenameTwo",
    (event, arg) => (setMkdirPath(arg))
  );

  return (
    <div>
      <h1 id="hoge">I am App Component!!!!</h1>
      <button
        onClick={() => {
          api.notificationApi.sendNotification("My custom notification!");
        }}
      >
        Notify
      </button>
      <div>
        <button
          onClick={() => {
            api.filesApi.openFile();
          }}
        >
          コピー元フォルダ検索
        </button>
        <input
          value={originaldirPath}
          onChange={(event) => handleInputChangedOriginal(event)}
        />
      </div>

      <div>
      <button
          onClick={() => {
            api.filesApi.openFileTwo();
          }}
        >
          コピー先フォルダ検索
        </button>
        <input
          value={mkdirPath}
          onChange={(event) => handleInputChangedMkdir(event)}
        />
      </div>

      <ul id="list"></ul>
      <button
        onClick={() => {
          api.filesApi.copyFile(fileArray);
        }}
        >コピー実行
      </button>
    </div>
  );
};

export default Button;
