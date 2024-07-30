const { CronJob } = require('cron');
const { dailyTask } = require('./cron/dailyTask');

const cronJob = new CronJob('0 8 * * *', dailyTask, null, false, 'America/New_York');

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      cronJob.start();
    }
    return config;
  },
};
