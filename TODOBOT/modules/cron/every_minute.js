const { CronJob } = require('cron');

module.exports = new CronJob('0 * * * * *', null, null, true, 'America/Los_Angeles');