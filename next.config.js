import { CronJob } from 'cron';
import { dailyTask } from './cron/dailyTask.js';

const cronJob = new CronJob('0 8 * * *', dailyTask, null, false, 'America/New_York');

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      cronJob.start();
    }
    return config;
  },
};

export default nextConfig;
