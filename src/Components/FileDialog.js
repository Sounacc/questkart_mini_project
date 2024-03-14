// FileDialog.js

import React from 'react';

const FileDialog = ({ handleFileSelection, fileLocation }) => {
  return (
    <>
      <input type="file" onChange={handleFileSelection} />
    </>
  );
};

export default FileDialog;
