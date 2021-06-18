/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import DirSerchForm from "./DirSerchForm";
import FilesList from "./FilesList";

const SearchDir = () => {
  const [copyToPath, setCopyToPath] = useState("コピー先ファイルパス");
  const [originalDirPath, setOriginalDirPath] =
    useState("コピー元ファイルパス");
  const [xlsxFilePath, setXlsxFilePath] = useState("エクセルファイルパス");
  const [filesInfo, setFilesInfo] = useState([]);

  const handleInputChangedCopyTo = (event) => {
    const inputValue = event.target.value;
    setCopyToPath(inputValue);
  };

  const handleInputChangedOriginal = (event) => {
    const inputValue = event.target.value;
    setOriginalDirPath(inputValue);
  };

  const handleInputChangedXlsx = (event) => {
    const inputValue = event.target.value;
    setXlsxFilePath(inputValue);
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
    //エクセルファイルパスをダイアログで選択したものに変更する
    api.on("xlsxFilePath", (_, arg) => {
      setXlsxFilePath(arg);
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

      <DirSerchForm
        label="エクセルファイル"
        path={xlsxFilePath}
        onSearch={() => {
          api.filesApi.searchXlsxFile();
        }}
        onChangePath={(event) => {
          handleInputChangedXlsx(event);
        }}
      />

      <FilesList filesInfo={filesInfo} />

      <button
        onClick={() => {
          api.filesApi.xlsxOutput({
            copyTo: copyToPath,
            original: originalDirPath,
            files: filesInfo,
          });
        }}
      >
        コピー実行
      </button>

      <button
        onClick={() => {
          api.filesApi.xlsxLoad(xlsxFilePath);
        }}
      >
        エクセル読み込み
      </button>
    </div>
  );
};

export default SearchDir;
