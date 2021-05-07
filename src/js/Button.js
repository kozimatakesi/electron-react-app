import React from "react";

const Button = () => {
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
      <button
        onClick={() => {
          api.filesApi.openFile();
        }}
      >
        ファイル検索
      </button>
      <ul id="list"></ul>
    </div>
  );
};

export default Button;
