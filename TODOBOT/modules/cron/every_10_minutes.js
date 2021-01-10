const { CronJob } = require('cron');

exports.job = new CronJob('0 */10 * * * *', () => {

    // do nothing, callback will be added
    // when this job is instantiated
    
}, null, true, 'America/Los_Angeles');