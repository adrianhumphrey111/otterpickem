import axios from 'axios';
import NodeCache from 'node-cache';
import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';

const cache = new NodeCache({ stdTTL: 43200 }); // 12 hours in seconds

function cleanHTML(htmlString) {
  // Parse the HTML string using jsdom
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  // Remove all unwanted attributes from elements
  const elements = document.querySelectorAll('*');

  elements.forEach(element => {
    // Remove specific attributes related to styling, class, href, and accessibility
    element.removeAttribute('class');
    element.removeAttribute('style');
    element.removeAttribute('tabindex');
    element.removeAttribute('role');
    element.removeAttribute('href');

    // Remove any attributes that start with 'data-'
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        element.removeAttribute(attr.name);
      }
    });

    // Remove empty elements
    if (!element.textContent.trim() && !element.children.length) {
      element.remove();
    }

    // Remove unnecessary tags (e.g., svg, use)
    if (['svg', 'use'].includes(element.tagName.toLowerCase())) {
      element.remove();
    }
  });

  // Return the cleaned HTML string
  return document.body.innerHTML;
}

export async function getCurrentOPS() {
  const cachedData = cache.get('teamOPS');
  if (cachedData) {
    console.log("Using cached OPS data");
    return cachedData;
  }
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.espn.com/mlb/stats/team', { waitUntil: 'networkidle2', timeout: 60000 });

    const tableHTML = await page.evaluate(() => {
      const table = document.querySelector('.Table2__title--remove-capitalization');
      console.log()
      return table.outerHTML;
    });

    await browser.close();

    const prompt = `
    Extract the MLB team batting stats and group the object keys by batting stat, with the value being an 
    array of the teams values ranked from highest to least with the corresponding stat the team has
    Only include the JSON object in your response, without any additional text.
    
    ${cleanHTML(tableHTML)}
    `;

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: "claude-3-5-sonnet-20240620",
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

    const teamOPS = JSON.parse(response.data.content[0].text);
    cache.set('teamOPS', teamOPS);
    return teamOPS;
  } catch (error) {
    console.error('Error getting team OPS:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const teamOPS = await getCurrentOPS();
      res.status(200).json(teamOPS);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
