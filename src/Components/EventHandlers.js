// eventHandlers.js

/**
 * Handles the change in source type selection.
 * @param {Array} sources - Array of source objects.
 * @param {function} setSources - State setter function for sources.
 * @param {number} index - Index of the source.
 * @returns {function} Event handler function.
 */
const handleSourceChange = (sources, setSources, index) => (event) => {
  const newSources = [...sources];
  newSources[index].type = event.target.value;
  newSources[index].openDialog = true;
  setSources(newSources);
};

/**
 * Handles file selection for a source.
 * @param {Array} sources - Array of source objects.
 * @param {function} setSources - State setter function for sources.
 * @param {number} index - Index of the source.
 * @returns {function} Event handler function.
 */
const handleFileSelection = (sources, setSources, index) => (event) => {
  const newSources = [...sources];
  newSources[index].fileLocation = event.target.files[0].name;
  newSources[index].openDialog = false;
  setSources(newSources);
};

/**
 * Handles database information change for a source.
 * @param {Array} sources - Array of source objects.
 * @param {function} setSources - State setter function for sources.
 * @param {number} index - Index of the source.
 * @returns {function} Event handler function.
 */
const handleDatabaseInfoChange = (sources, setSources, index) => (event) => {
  const newSources = [...sources];
  newSources[index].databaseInfo[event.target.name] = event.target.value;
  setSources(newSources);
};

/**
 * Handles database submission for a source.
 * @param {Array} sources - Array of source objects.
 * @param {function} setSources - State setter function for sources.
 * @param {number} index - Index of the source.
 * @returns {function} Event handler function.
 */
const handleDatabaseSubmit = (sources, setSources, index) => () => {
  const newSources = [...sources];
  newSources[index].openDialog = false;
  setSources(newSources);
};

// OperationHandler.js

const handleOperationChange = (event, setSelectedOperation) =>() => {
  setSelectedOperation(event.target.value);
};


export { handleSourceChange, handleFileSelection, handleDatabaseInfoChange, handleDatabaseSubmit, handleOperationChange};
