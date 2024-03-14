import React, { useState } from 'react';
import Papa from 'papaparse';

function CsvReader() {
  const [headers, setHeaders] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;
      Papa.parse(csvData, {
        complete: (result) => {
          if (result.data.length > 0 && result.data[0].length > 0) {
            setHeaders(result.data[0]);
          }
        },
        header: false,
      });
    };

    reader.readAsText(file);
  };

  return (
    <div className="container">
      <input type="file" onChange={handleFileChange} />
      <h2>CSV Column Headers</h2>
      <div>
        {headers.length > 0 && (
          <table className="table-container">
            <tbody>
              {headers.map((header, index) => (
                <tr key={index}>
                  <th className="header-button">{header}</th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CsvReader;
