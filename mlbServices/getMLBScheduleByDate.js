import axios from 'axios';
import { chromium } from 'playwright';

async function getESPNMLBScheduleByDate(date) {
    let browser = null;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        const formattedDate = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        await page.goto(`https://www.espn.com/mlb/schedule/_/date/${formattedDate}`, { waitUntil: 'networkidle' });

        const tableHTML = await page.evaluate(() => {
            const tableWrapper = document.querySelector('.ResponsiveTable');
            return tableWrapper ? tableWrapper.outerHTML : null;
        });

        return tableHTML;
    } catch (error) {
        console.error('Error fetching MLB schedule:', error);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
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
            model: "claude-3-opus-20240229",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY
            }
        });

        return response.data.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error);
        return null;
    }
}

export async function getMLBScheduleByDate(date) {
    const scheduleHTML = await getESPNMLBScheduleByDate(date);
    if (scheduleHTML) {
        return await sendToClaudeAPI(scheduleHTML);
    }
    return null;
}
