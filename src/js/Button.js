import React, { useState, useEffect } from "react";

const Button = () => {
  const [mkdirPath, setMkdirPath] = useState("コピー先ファイルパス");
  const [originaldirPath, setOriginaldirPath] = useState("コピー元ファイルパス");
  const [fileList, setFileList] = useState([]);
  const [fileInfo, setFileInfo] = useState([]);

  const handleInputChangedMkdir = (event) => {
    const inputValue = event.target.value;
    setMkdirPath(inputValue);
  };

  const handleInputChangedOriginal = (event) => {
    const inputValue = event.target.value;
    setOriginaldirPath(inputValue);
  };

  //fileInfoの要素数がfileListの要素数と等しくなったらlistItemsを表示する
  let listItems = "";
  if(fileInfo.length === fileList.length) {
    listItems = fileInfo.map((file, idx) =>
      <tr key={idx}>
        <td>{file.file}</td>
        <td>{file.stats.size}byte</td>
        <td>{file.stats.mtime.toString()}</td>
      </tr>
    )
  }


  useEffect(() => {
    //コピー元ファイルパスをダイアログで選択したものに変更する
    api.on("filename", (_, arg) => {
      setOriginaldirPath(arg);
    });

    //コピー先ファイルパスをダイアログで選択したものに変更する
    api.on("copyFolderPath", (_, arg) => {
      setMkdirPath(arg);
    });

    //channel:allFilesにsendがあったとき、指定ファイルパス内のファイルをリストで表示
    api.on("allFiles", (_, allFiles) => {
      setFileList(allFiles);
    });

    api.on("allFilesInfo", (_, stats) => {
      setFileInfo(stats);
      console.log(stats);
    })

  }, []);

  return (
    <div>
      <h1 id="hoge">ファイルコピー君</h1>
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
          onChange={(event) => {
            handleInputChangedOriginal(event);
          }}
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
          onChange={(event) => {
            handleInputChangedMkdir(event);
          }}
        />
      </div>

      <table border="1">
        <tr>
          <th>
            ファイル名
          </th>
          <th>
            ファイルサイズ
          </th>
          <th>
            更新日時
          </th>
        </tr>
        {listItems}

      </table>


      <button
        onClick={() => {
          api.filesApi.copyFile({
            mkdir: mkdirPath,
            original: originaldirPath,
            files: fileList
          });
        }}
      >
        コピー実行
      </button>
    </div>
  );
};

export default Button;
