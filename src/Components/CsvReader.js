import Papa from 'papaparse';

export async function getCsvColumnHeaders(csvData) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      complete: (result) => {
        if (result.data.length > 0 && result.data[0].length > 0) {
          resolve(result.data[0]);
        } else {
          reject(new Error('No data found in the CSV file.'));
        }
      },
      header: false,
    });
  });
}

export async function handleFileChange(event, setHeaders) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = async (event) => {
    const csvData = event.target.result;
    try {
      const columnHeaders = await getCsvColumnHeaders(csvData);
      setHeaders(columnHeaders);
    } catch (error) {
      console.error('Error parsing CSV:', error);
    }
  };

  reader.readAsText(file);
}
