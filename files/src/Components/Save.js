import React from 'react';

function DownloadButton() {
  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:5000/download');

      if (!response.ok) {
        throw new Error('File download failed');
      }

      const blob = await response.blob();
      
      // Use File System Access API to save the file in a specific directory
      if ('showSaveFilePicker' in window) {
        const options = {
          suggestedName: 'filename.txt',
          types: [{
            description: 'Text Files',
            accept: { 'text/plain': ['.txt'] }, // Adjust the MIME types and extensions based on the file you are downloading
          }],
        };
        try {
          const handle = await window.showSaveFilePicker(options);
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          alert('File saved successfully!');
        } catch (err) {
          console.error('Error saving the file:', err);
          alert('Could not save the file.');
        }
      } else {
        // Fallback method: download directly using a Blob URL if File System Access API is not available
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'fallbackFilename.ext'); // Fallback filename
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return <button onClick={handleDownload}>Download File</button>;
}

export default DownloadButton;
