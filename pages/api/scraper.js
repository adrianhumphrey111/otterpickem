
const { chromium } = require('playwright');
const axios = require('axios');

async function getESPNMLBStatsHTML(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(url);

  const tableHTML = await page.evaluate(() => {
    const tableWrapper = document.querySelector('.ResponsiveTable');
    return tableWrapper.outerHTML;
  });

  await browser.close();

  return tableHTML;
}

// TODO: have a full proof for this because it is not returning the correct JSON
function extractJSONFromResponse(response) {
    return response
    const match = response.match(/```json\n([\s\S]*?)```/);
    return match ? match[1] : null;
  }

async function sendToClaudeAPI(html) {
  const prompt = `
  Extract all the table information with the MLB teams names and all the row information and export it as a JSON object with the keys being the team name and the value being an object with all the stats for that team. Here's the HTML:
    Just the Json so that I can send it back in an API response
  ${html}
  `;

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      messages: [
        { role: "user", content: prompt }
      ]
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    console.log(response.data)

    return extractJSONFromResponse(response.data.content[0].text);
  } catch (error) {
    console.error('Error calling Claude API:', error.response.data.error.message);
    throw error;
  }
}

// async function main() {
//   try {
//     const tableHTML = await getMLBStatsHTML();
//     const jsonString = await sendToClaudeAPI(tableHTML);
//     const stats = JSON.parse(jsonString);
//     console.log(stats);
//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// }

// main();

export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Process a POST request
      const mlbTeamStats = {}
      const battingTableHTML = await getESPNMLBStatsHTML('https://www.espn.com/mlb/stats/team');
      const battingJsonString = await sendToClaudeAPI(battingTableHTML);
      mlbTeamStats.batting = JSON.parse(battingJsonString);

      const pitchingTableHTML = await getESPNMLBStatsHTML('https://www.espn.com/mlb/stats/team/_/view/pitching');
      const pitchingJsonString = await sendToClaudeAPI(pitchingTableHTML);
      mlbTeamStats.pitching = JSON.parse(pitchingJsonString);

      const fieldingTableHTML = await getESPNMLBStatsHTML('https://www.espn.com/mlb/stats/team/_/view/fielding');
      const fieldingJsonString = await sendToClaudeAPI(fieldingTableHTML);
      mlbTeamStats.fielding = JSON.parse(fieldingJsonString);


      res.status(200).json(mlbTeamStats)
    } else {
      // Handle any other HTTP method
      res.status(403).json({ message: 'Unauthorized!' })
    }
  }