const fs = require('fs'),
  chalk = require('chalk'),
  moment = require('moment'),
  { format } = require('date-fns');

module.exports = {
  log: (content, type = 'log') => {
    const timestamp = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`;
    switch (type) {
      case 'log':
        return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
      case 'warn':
        return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
      case 'error': 
        return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
      case 'debug': 
        if (process.env.DEBUG === 'true') console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} \n`);
        return fs.appendFileSync('./logs/debug.log', `\n${timestamp}    ${content} `);
      case 'cmd':
        return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content} `);
      case 'ready': 
        return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
      case 'dba': 
        return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `)
      case 'mongo': 
        return console.log(`${timestamp} ${chalk.black.bgGreenBright(type.toUpperCase())} ${content}`)
      default: 
        throw new TypeError('Logger type must be either warn, debug, log, ready, cmd, dba or error.');
    }
  },
  error: (...args) => this.log(...args, 'error'),
  warn: (...args) => this.log(...args, 'warn'),
  ready: (...args) => this.log(...args, 'ready'),
  debug: (...args) => this.log(...args, 'debug'),
  cmd: (...args) => this.log(...args, 'cmd'),
  dba: (...args) => this.log(...args, 'dba'),
  mongo: (...args) => this.log(...args, 'mongo')
};
