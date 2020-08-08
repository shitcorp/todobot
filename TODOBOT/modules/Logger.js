// TODO: replace moment with date-fns

// TODO: make debug logger write to file

const { createWriteStream } = require('fs');
const chalk = require("chalk");
const moment = require("moment");
const { format } = require('date-fns');

//let writer = createWriteStream('../logs/debug.txt')

exports.log = (content, type = "log") => {
  const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
  switch (type) {
    case "log": {
      return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
    }
    case "warn": {
      return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
    }
    case "error": {
      return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
    }
    case "debug": {
      console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
      return writer.write(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `)
    }
    case "cmd": {
      return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content} `);
    }
    case "ready": {
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
    }
    case "dba": {
      return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `)
    }
    case "mongo": {
      return console.log(`${timestamp} ${chalk.black.bgGreenBright(type.toUpperCase())} ${content}`)
    }

    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
}; 


exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");

exports.dba = (...args) => this.log(...args, "dba");

exports.mongo = (...args) => this.log(...args, "mongo");