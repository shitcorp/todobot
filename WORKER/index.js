/**
 * @description 
 * IDEA for worker:
 * Bot posts jobs to worker, where they get put in a redis queue.
 * Every x seconds a corn job takes a job from the queue and tries
 * to post the content to the github api. To avoid further rate
 * limiting, we update the issue only, if the todo gets closed/ marked
 * as finished in discord.
 */

const express = require('express');
const { createServer } = require('http');
const { createClient } = require('redis');
const newjob = require('./logic/newjob');
const app = express();

const PORT = 3333;

const redisClient = createClient({
    host: "127.0.0.1",
    port: 6379
});




redisClient.on('error', console.error)
redisClient.on('warning', console.warn);

redisClient.on("ready", () => console.log('Redis Client is ready'));

app.use(express.json());

// health status
app.get('/health', (req, res) => {
    res.json({ healthy: true });
});

app.post('/newjob', (req, res) => newjob(req, res, redisClient));

const server = createServer(app);
server.listen(PORT);
console.log('App is listening on port ' + PORT);