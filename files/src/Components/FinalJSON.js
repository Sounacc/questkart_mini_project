/**
 * Creates a JSON object with specified source data and operations.
 *
 * @param {any} source_left - The left source data for the operation.
 * @param {any} source_right - The right source data for the operation.
 * @param {Array} operations - An array of operations to be performed on the source data.
 * @returns {Object} A JSON object containing the source data and operations.
 */
export default function createJSONObject(source_left, source_right, operations) {
  // Construct the final JSON object
  const jsonObject = {
    source_left,
    source_right,
    operations,
  };

  return jsonObject;
}
