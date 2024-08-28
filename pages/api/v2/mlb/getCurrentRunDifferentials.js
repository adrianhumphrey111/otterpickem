import axios from 'axios';
import NodeCache from 'node-cache';
import puppeteer from 'puppeteer';
const cache = new NodeCache({ stdTTL: 86400 }); // 24 hours in seconds

export async function getCurrentRunDifferentials() {
  const t = {"NY Yankees":{"home":36,"away":93},"Philadelphia":{"home":96,"away":24},"LA Dodgers":{"home":64,"away":51},"Milwaukee":{"home":40,"away":70},"Kansas City":{"home":51,"away":56},"Baltimore":{"home":26,"away":61},"Arizona":{"home":37,"away":50},"San Diego":{"home":-7,"away":76},"Houston":{"home":55,"away":12},"Minnesota":{"home":50,"away":17},"Cleveland":{"home":43,"away":23},"Atlanta":{"home":-6,"away":63},"NY Mets":{"home":18,"away":17},"Chi Cubs":{"home":33,"away":-1},"Cincinnati":{"home":-15,"away":43},"Seattle":{"home":42,"away":-24},"Detroit":{"home":-12,"away":29},"Boston":{"home":-47,"away":56},"SF Giants":{"home":14,"away":-25},"Pittsburgh":{"home":-36,"away":-6},"Texas":{"home":25,"away":-70},"Tampa Bay":{"home":-32,"away":-27},"St. Louis":{"home":-16,"away":-45},"Washington":{"home":-26,"away":-36},"Toronto":{"home":-46,"away":-17},"Oakland":{"home":-16,"away":-63},"LA Angels":{"home":-73,"away":-54},"Miami":{"home":-117,"away":-67},"Colorado":{"home":-38,"away":-170},"Chi Sox":{"home":-122,"away":-157}}

return t
  const cachedData = cache.get('runDifferentials');
  if (cachedData) {
    console.log("we have cached data")
    return cachedData;
  }
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.teamrankings.com/mlb/stat/run-differential');

    const tableHTML = await page.evaluate(() => {
      const table = document.querySelector('.datatable');
      return table.outerHTML;
    });

    await browser.close();

    const prompt = `
    Extract the MLB team run differentials from this HTML table and return it as a JSON object.
    The JSON object should have team names as keys and their run differentials as values.
    
    I would like the the run differential for each team both home and away
    
    Only include the JSON object in your response, without any additional text.
    
    ${tableHTML}
    `;

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

    const runDifferentials = JSON.parse(response.data.content[0].text);
    cache.set('runDifferentials', runDifferentials);
    return runDifferentials;
  } catch (error) {
    console.error('Error getting run differentials:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const runDifferentials = await getCurrentRunDifferentials();
      res.status(200).json(runDifferentials);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
