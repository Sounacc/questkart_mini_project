/**
 * Generates JSON data based on the provided sources.
 * @param {Array} sources - An array of source objects containing information.
 * @returns {Object} - A JSON object representing the merged data from sources.
 */
const generateJsonData = (sources) => {
  const jsonData = {};
  sources.forEach((source, index) => {
    const sourceKey = `source_${index + 1}`;
    if (source.type === 'file') {
      jsonData[sourceKey] = {
        source_type: 'file',
        location: source.fileLocation
      };
    } else if (source.type === 'database') {
      jsonData[sourceKey] = {
        source_type: 'database',
        ...source.databaseInfo
      };
    }
  });
  return jsonData;
};

/**
 * Saves JSON data to a file and triggers a download of the file.
 * @param {Object} jsonData - The JSON object to be saved.
 */
const saveJSONToFile = (jsonData) => {
  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'merged_data.json');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { generateJsonData, saveJSONToFile };
