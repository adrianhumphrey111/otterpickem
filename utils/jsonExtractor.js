export function extractJsonFromResponse(response) {
  try {
    // Find the start and end of the JSON content
    const startIndex = response.indexOf('```json');
    const endIndex = response.lastIndexOf('```');

    if (startIndex === -1 || endIndex === -1) {
      throw new Error('JSON content not found in the response');
    }

    // Extract the JSON string
    const jsonString = response.substring(startIndex + 7, endIndex).trim();

    // Parse the JSON string into an object
    const jsonObject = JSON.parse(jsonString);

    return jsonObject;
  } catch (error) {
    console.error('Error extracting JSON:', error.message);
    return null;
  }
}
