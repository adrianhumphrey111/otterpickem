const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require('cheerio');
const { extractJsonFromResponse } = require("../utils/jsonExtractor")
require('dotenv').config(); // Make sure to install dotenv and create a .env file with your API key

const LIVE_SCORE_BOARD_URL = "https://www.fangraphs.com/livescoreboard.aspx?date=";
const FANGRAPHS_BASE_URL = "https://www.fangraphs.com";

async function setupBrowser() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  return { browser, page };
}

async function getScheduleDataFromClaude(html) {
    const prompt = `
    ${html}

    In the html above I want you to create an array of Game{} objects that have the following keys, get the away team, and return the url of the away team in the away team object, the same for the home team, as well ass the starting pitchers (sp) for each
    `;
  
    try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model:"claude-3-5-sonnet-20240620",
        max_tokens: 4096,
        temperature: 0,
        system: "You are an expert data analyzer and good at pulling data out of html code and returning structured JSON objects with the information you are given. You only return structured json in your response and not text about the json",
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
  
      return extractJsonFromResponse(response.data.content[0].text);
    } catch (error) {
        console.log(error.response.data)
    }
  }

export async function getAllGames(date) {
    try {
        const response = await axios.get(`${LIVE_SCORE_BOARD_URL}${date}`);
        const htmlContent = response.data;

        // Load the HTML into cheerio
        const $ = cheerio.load(htmlContent);

        // Select the specific part of the HTML
        const gamePanel = $('#LiveBoard1_LiveBoard1_litGamesPanel').html();

        // Now gamePanel contains the HTML only within the specific selector
        return await getScheduleDataFromClaude(gamePanel);
      } catch (error) {
        console.error('Error fetching MLB games:', error);
        throw error;
      }
}


//getAllGames("2024-07-19").catch(console.error);

export async function getPitcherStats(playerUrl) {
  try {
    const { browser, page } = await setupBrowser();
    await page.goto(`${FANGRAPHS_BASE_URL}${playerUrl}`);

    const statsHtml = await page.evaluate(() => {
      const statsTable = document.querySelector('#SeasonStats1_dgSeason11_ctl00');
      return statsTable ? statsTable.outerHTML : null;
    });

    await browser.close();

    if (!statsHtml) {
      throw new Error('Stats table not found');
    }

    return await getPitcherStatsFromClaude(statsHtml);
  } catch (error) {
    console.error('Error fetching pitcher stats:', error);
    throw error;
  }
}

async function getPitcherStatsFromClaude(html) {
  const prompt = `
    ${html}

    Extract the pitcher's statistics from the HTML table above. Return a JSON object with the following keys:
    - name
    - team
    - gamesPlayed
    - gamesStarted
    - inningsPitched
    - wins
    - losses
    - era
    - whip
    - strikeouts
    - walks

    Only return the JSON object, no additional text.
  `;

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0,
      system: "You are an expert data analyzer and good at pulling data out of html code and returning structured JSON objects with the information you are given. You only return structured json in your response and not text about the json",
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

    return extractJsonFromResponse(response.data.content[0].text);
  } catch (error) {
    console.error('Error calling Claude API for pitcher stats:', error);
    throw error;
  }
}
