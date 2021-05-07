import React, { useEffect } from "react";

const File = () => {
  useEffect(() => {
    //getElementByIdができないため、useEffectにてレンダリング後に実行
    const element = document.getElementById("list");

    //channel:allFilesにsendがあったとき、指定ファイルパス内のファイルをリストで表示
    api.on("allFiles", (event, arg) => {
      element.innerHTML = "";
      arg.forEach((file) => {
        element.insertAdjacentHTML("beforeend", `<li>${file}</li>`);
      });
    });
  }, []);

  return <h2>Hi</h2>;
};

export default File;
