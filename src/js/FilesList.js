import React from "react";

const FilesList = ({ filesInfo }) => {
  return (
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
  );
};

export default FilesList;
