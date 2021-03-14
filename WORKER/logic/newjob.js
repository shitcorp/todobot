module.exports = async ({ body }, res, redisClient) => {
    /**
     * expect job object to look like this:
     * {
     *  timestamp: UNIX Timestamp,
     *  todoobj: todoobj with important information {
     *    projecturl: ...,
     *    the other stuff [...]
     *  }
     * }
     */

    const getAsync = (require('util')).promisify(redisClient.get).bind(redisClient);
    const alreadyRequested = await getAsync('REQUESTBLOCKER');

    if (alreadyRequested !== null) {
        // put the todoobj in the queue
        redisClient.lpush('QUEUE', JSON.stringify(body.todoobj))
    } else {
        // do the request directly and put another REQUESTBLOCKER in
        redisClient.set('REQUESTBLOCKER', 'active')
        // 2 minutes expiry so we do a request every 2 minutes
        redisClient.expire('REQUESTBLOCKER', 120)
    }

};