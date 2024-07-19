export function extractJsonFromResponse(response) {

  try {
    const json = JSON.parse(response)
    return json
  }catch(e){
    console.log(e)
  }

  // If response is a string, try to extract JSON from it
  if (typeof response === 'string') {
    try {
      // First, try to parse the entire string as JSON
      return JSON.parse(response);
    } catch (error) {
      // If that fails, try to extract JSON from markdown code blocks
      try {
        const startIndex = response.indexOf('```json');
        const endIndex = response.lastIndexOf('```');
        if (startIndex === -1 || endIndex === -1) {
          console.log("there is no json content found, try just return the json parse")
          return JSON.parse(response)
        }
        const jsonString = response.substring(startIndex + 7, endIndex).trim();
        return JSON.parse(jsonString);
      } catch (error) {
        console.error('Error extracting JSON:', error.message);
        return null;
      }
    }
  }

  // If response is neither an object nor a string, return null
  console.error('Response is neither an object nor a string');
  return null;
}
