const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require('cheerio');
const { extractJsonFromResponse } = require("../utils/jsonExtractor")
require('dotenv').config(); // Make sure to install dotenv and create a .env file with your API key

const LIVE_SCORE_BOARD_URL = "https://www.fangraphs.com/livescoreboard.aspx?date=";

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