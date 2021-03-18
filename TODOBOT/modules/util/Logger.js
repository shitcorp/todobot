const apm = require('elastic-apm-node');
const path = require('path');
const bunyan = require('bunyan');
const streams_prod = {
  path: path.join(__dirname + '../../../logs/' + process.env.BOT_NAME + '.log')
}
const streams_dev = {
  stream: process.stderr
}
const streams = [];

process.env.DEV === 'true' ? streams.push(streams_dev) : streams.push(streams_prod)

const log = bunyan.createLogger({
  name: process.env.BOT_NAME,
  streams
});


exports.log = (content, type = "log") => {
  switch (type) {
    case "log": {
      return log.info(content)
    }
    case "warn": {
      return log.warn(content);
    }
    case "error":
    case "debug": {
      apm.captureError(content);
      return log.debug(content);
    }
    case "cmd": {
      return log.info(content);
    }
    case "ready": {
      return log.info('[READY] ' + content);
    }
    case "mongo": {
      return log.info('[MONGO] ' + content);
    }
    case "redis": {
      return log.info('[REDIS] ' + content);
    }

    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd, dba or error.");
  }
}; 


exports.error = (...args) => this.log(...args, "error");
exports.warn = (...args) => this.log(...args, "warn");
exports.ready = (...args) => this.log(...args, "ready");
exports.debug = (...args) => this.log(...args, "debug");
exports.cmd = (...args) => this.log(...args, "cmd");
exports.dba = (...args) => this.log(...args, "dba");
exports.mongo = (...args) => this.log(...args, "mongo");
exports.redis = (...args) => this.log(...args, "redis");