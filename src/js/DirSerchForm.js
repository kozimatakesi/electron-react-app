import React from "react";

const DirSerchForm = ({ label, path, onSearch, onChangePath }) => {
  return (
    <div>
      <button onClick={onSearch}>{label}</button>
      <input value={path} onChange={onChangePath} />
    </div>
  );
};

export default DirSerchForm;
