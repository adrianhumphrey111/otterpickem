import { trimHtml } from "../utils/trimHTML";

const axios = require("axios");
const cheerio = require('cheerio');
const { extractJsonFromResponse } = require("../utils/jsonExtractor")

const LIVE_SCORE_BOARD_URL = "https://www.fangraphs.com/livescoreboard.aspx?date=";
const FANGRAPHS_BASE_URL = "https://www.fangraphs.com";

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

export async function getPitcherStats(playerUrl) {
  try {
    
    const response = await axios.get(`${FANGRAPHS_BASE_URL}/${playerUrl}`);
    const htmlContent = response.data;

    // Load the HTML into cheerio
    let $ = cheerio.load(htmlContent);

    const dashboardTable = $('#dashboard').html();
    const advanced = $('#advanced').html();
    const statcast = $('#statcast').html();
    const pitchVales = $('#pitch-values').html();
    const pitchTypeVelocity = $('#pitch-type-velo').html();

    // Navigate to the players game log
    const gameLogLink = $('a:contains("Game Log")').first();

    if (!gameLogLink.length) {
      console.log('Game log link not found');
      return;
    }
  
    // // Get the href attribute of the link
    // const gameLogUrl = gameLogLink.attr('href');

    // const gameLogResponse = await axios.get(`${FANGRAPHS_BASE_URL}/${gameLogUrl}`);
    // const gameLogHtmlContent = gameLogResponse.data;

    // $ = cheerio.load(gameLogHtmlContent);
    // const gameLogHTML = $('#root-player-pages').html();
    
    
    
    const pitherInfoHtml = dashboardTable + advanced + statcast + pitchVales + pitchTypeVelocity;
    
    // Get pitchers game log
    const trimmed = trimHtml(pitherInfoHtml)
    
    return await getPitcherStatsFromClaude(trimmed);
  } catch (error) {
    console.error('Error fetching pitcher stats:', error.response);
  }
}

async function getPitcherStatsFromClaude(html) {
  const prompt = `
    <html>
    ${html}

    Extract the pitcher's statistics from the HTML table above only for the 2024 season and at the MLB Level. Return a JSON object with the following keys:
    FIP (Fielding Independent Pitching): This is crucial as it measures a pitcher's effectiveness at preventing home runs, walks, and hit by pitches while causing strikeouts, independent of fielding.
    WHIP (Walks plus Hits per Inning Pitched): This gives a clear picture of how many baserunners a pitcher allows.
    K/9 (Strikeouts per 9 innings): High strikeout rates indicate dominance and the ability to get out of tough situations.
    BB/9 (Walks per 9 innings): Control is vital; fewer walks mean fewer free baserunners.
    HR/9 (Home Runs allowed per 9 innings): Keeping the ball in the park is crucial for preventing runs.
    LOB% (Left On Base Percentage): This shows how well a pitcher performs with runners on base.
    Hard Hit%: The percentage of batted balls hit hard against a pitcher, indicating how hittable they are.
    Ground Ball%: Ground ball pitchers can induce double plays and generally allow fewer extra-base hits.
    ERA (Earned Run Average): While not as predictive as FIP, it's still important to consider.
    IP/GS (Innings Pitched per Game Started): This indicates how deep into games a starter typically pitches.

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
    return error.response.data.error.message
  }
}
