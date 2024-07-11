const schedule = require('node-schedule');
const { refreshMLBStats } = require('./utils/mlbStats');

// Run every day at 3:00 AM
const job = schedule.scheduleJob('0 3 * * *', function() {
  refreshMLBStats();
});

console.log('Cron job scheduled');