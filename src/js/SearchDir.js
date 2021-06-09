/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import DirSerchForm from "./DirSerchForm";

const SearchDir = () => {
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
      <DirSerchForm
        label="コピー元フォルダ"
        path={originalDirPath}
        onSearch={() => {
          api.filesApi.searchOriginalDir();
        }}
        onChangePath={(event) => {
          handleInputChangedOriginal(event);
        }}
      />
      <DirSerchForm
        label="コピー先フォルダ"
        path={copyToPath}
        onSearch={() => {
          api.filesApi.searchCopyToDir();
        }}
        onChangePath={(event) => {
          handleInputChangedCopyTo(event);
        }}
      />

      <table border="1">
        <tr>
          <th>ファイル名</th>
          <th>ファイルサイズ</th>
          <th>更新日時</th>
        </tr>
        {filesInfo &&
          filesInfo.map((file, idx) => (
            <tr key={idx}>
              <td>{file.name}</td>
              <td>{file.stats.size}byte</td>
              <td>{file.stats.mtime.toString()}</td>
            </tr>
          ))}
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

export default SearchDir;
