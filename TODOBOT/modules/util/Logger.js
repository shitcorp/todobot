const ecsFormat = require('@elastic/ecs-pino-format');
const pino = require('pino');

const Log = pino(ecsFormat({ convertReqRes: true }));

exports.log = (content, type = "log") => {
  switch (type) {
    case "log": {
      return Log.info(content)
    }
    case "warn": {
      return Log.warn(content);
    }
    case "cmd": {
      return Log.info(content);
    }
    case "ready": {
      return Log.info('[READY] ' + content);
    }
    case "mongo": {
      return (Log.child({ module: 'mongo' })).info(content);
    }
    case "redis": {
      return (Log.child({ module: 'redis' })).info(content);
    }
    case 'error': {
      return Log.error(content)
    }
    case 'http': {
      return (Log.child({ module: 'http' })).info(content);
    }

    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd, dba or error.");
  }
}; 


exports.Error = (... args) => this.log(...args, 'error');
exports.warn = (...args) => this.log(...args, "warn");
exports.ready = (...args) => this.log(...args, "ready");
exports.cmd = (...args) => this.log(...args, "cmd");
exports.dba = (...args) => this.log(...args, "dba");
exports.mongo = (...args) => this.log(...args, "mongo");
exports.redis = (...args) => this.log(...args, "redis");
exports.http = (...args) => this.log(...args, "http");