
export default function createJSONObject(source_left,source_right,operations) {
    // Construct the final JSON object
    const jsonObject = {
      source_left,
      source_right,
      operations,
    };
  
    return jsonObject;
  }