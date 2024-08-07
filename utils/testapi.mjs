import fetch from 'node-fetch';

const apiUrl = 'https://api.sportradar.com/mlb/trial/v7/en/games/80b9d0a7-6d31-4940-a280-53f9fe1caac7/boxscore.json?api_key=TuDgFt1aOe3MKRW9KvEUs5PfolU0N0LTaASzocHJ';

async function makeRequest() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            const text = await response.text();
            console.error('Error Response Text:', text);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error making request:', error);
        return null;
    }
}

function measureRequestsPerSecond() {
    const totalRequests = 15;
    const duration = 4000; // 4 seconds
    const delay = duration / totalRequests; // Delay between requests

    let requestCount = 0;

    function makeRequests() {
        if (requestCount < totalRequests) {
            makeRequest().then(() => {
                requestCount++;
                setTimeout(makeRequests, delay); // Delay next request
            });
        } else {
            console.log(`Requests made: ${requestCount} in ${duration / 1000} seconds`);
        }
    }
    makeRequests();
}

measureRequestsPerSecond();
