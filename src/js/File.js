import React, { useEffect } from 'react';

const File = () => {

  useEffect(() => {
    const element = document.getElementById('list');
    api.on('allFiles', (event, arg) => {
      element.innerHTML = '';
      arg.forEach(file => {
        element.insertAdjacentHTML('beforeend',`<li>${file}</li>`);
      });
    });
  },[]);

  api.on('filename', (event, arg) => document.querySelector('#hoge').textContent = arg);


  return(
    <h2>Hi</h2>
  )
}

export default File;