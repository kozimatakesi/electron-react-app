import React, { useState, useEffect } from "react";

const FilesList = () => {
  const [copyToPath, setCopyToPath] = useState("コピー先ファイルパス");
  const [originalDirPath, setOriginalDirPath] =
    useState("コピー元ファイルパス");
  const [filesInfo, setFilesInfo] = useState([]);

  const handleInputChangedCopyTo = (event) => {
    const inputValue = event.target.value;
    setCopyToPath(inputValue);
  };

  const handleInputChangedOriginal = (event) => {
    const inputValue = event.target.value;
    setOriginalDirPath(inputValue);
  };

  //filesInfoが更新されたらlistItemsを表示する
  let listItems = "";
  if (filesInfo) {
    listItems = filesInfo.map((file, idx) => (
      <tr key={idx}>
        <td>{file.name}</td>
        <td>{file.stats.size}byte</td>
        <td>{file.stats.mtime.toString()}</td>
      </tr>
    ));
  }

  useEffect(() => {
    //コピー元ディレクトリパスをダイアログで選択したものに変更する
    api.on("originalDirPath", (_, arg) => {
      setOriginalDirPath(arg);
    });

    //コピー先ディレクトリパスをダイアログで選択したものに変更する
    api.on("copyToDirPath", (_, arg) => {
      setCopyToPath(arg);
    });
    //コピー元ディレクトリパス内の全ファイルのファイル名、スタッツを取得
    api.on("allFilesInfo", (_, arg) => {
      setFilesInfo(arg);
    });
  }, []);

  return (
    <div>
      <h1 id="hoge">ファイルコピー君</h1>
      <div>
        <button
          onClick={() => {
            api.filesApi.searchOriginalDir();
          }}
        >
          コピー元フォルダ検索
        </button>
        <input
          value={originalDirPath}
          onChange={(event) => {
            handleInputChangedOriginal(event);
          }}
        />
      </div>

      <div>
        <button
          onClick={() => {
            api.filesApi.searchCopyToDir();
          }}
        >
          コピー先フォルダ検索
        </button>
        <input
          value={copyToPath}
          onChange={(event) => {
            handleInputChangedCopyTo(event);
          }}
        />
      </div>

      <table border="1">
        <tr>
          <th>ファイル名</th>
          <th>ファイルサイズ</th>
          <th>更新日時</th>
        </tr>
        {listItems}
      </table>

      <button
        onClick={() => {
          api.filesApi.copyFile({
            copyTo: copyToPath,
            original: originalDirPath,
            files: filesInfo,
          });
        }}
      >
        コピー実行
      </button>
    </div>
  );
};

export default FilesList;
