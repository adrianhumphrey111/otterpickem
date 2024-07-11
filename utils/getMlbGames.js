const axios = require('axios');
const cache = require('./cache');
const { chromium } = require('playwright');

async function getESPNMLBScheduleToday() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto("https://www.espn.com/mlb/schedule");

    const tableHTML = await page.evaluate(() => {
    const tableWrapper = document.querySelector('.Table__ScrollerWrapper');
        return tableWrapper.outerHTML;
    });

    await browser.close();
    return tableHTML;
}


async function sendToClaudeAPI(html) {
    const prompt = `
    Extract the game information and return it as a JSON object. 
    Your response should contain ONLY the JSON object, without any additional text or explanation.
    The JSON object should have a 'games' key containing an array of game objects.
    Each game object should have 'awayTeam', 'homeTeam', 'time', 'awayPitcher', and 'homePitcher' keys.
    
    ${html}`;
  
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
  
      return JSON.parse(response.data.content[0].text);
    } catch (error) {
      console.error('Error calling Claude API:', error.response.data.error.message);
      throw error;
    }
  }

async function fetchMLBStats() {
  const scheduleHTML = await getESPNMLBScheduleToday()
  return await sendToClaudeAPI(scheduleHTML)
}

async function getMLBSchedule() {
  let stats = cache.get('mlbStats');
  if (!stats) {
    console.log('Cache miss. Fetching new MLB stats...');
    stats = await fetchMLBStats();
    cache.set('mlbStats', stats);
  } else {
    console.log('Serving MLB stats from cache');
  }
  return stats;
}

async function refreshMLBSchedule() {
  console.log('Refreshing MLB stats cache...');
  const stats = await fetchMLBStats();
  cache.set('mlbStats', stats);
  console.log('MLB stats cache refreshed');
}

module.exports = { getMLBSchedule, refreshMLBSchedule };