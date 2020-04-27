const winston = require('winston')
const settings = require('../settings')
const moment = require('moment-timezone')
moment.locale('ko-KR')
const getDateFormat = (date) => moment(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')

const Console = new winston.transports.Console()
const colorizer = winston.format.colorize()

const logLevels = {
  levels: { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 },
  colors: { error: 'red', warn: 'yellow', info: 'green', http: 'green', verbose: 'gray', debug: 'cyan', silly: 'yellow' }
}
winston.addColors(logLevels)
const logger = winston.createLogger({
  level: settings.logger.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.printf(info => colorizer.colorize(info.level, `[${getDateFormat(Date.now())}] [${info.level.toUpperCase()}] ${info.message}`))
  ),
  transports: [Console]
})

class Logger {
  constructor (client = {}) {
    this.client = client
    this._logger = logger
  }

  error (...args) { this._logger.error(this.getMessage(...args)) }
  warn (...args) { this._logger.warn(this.getMessage(...args)) }
  info (...args) { this._logger.info(this.getMessage(...args)) }
  debug (...args) { this._logger.debug(this.getMessage(...args)) }

  getMessage (message = undefined) {
    let msg
    if (process.argv[2] === '--inspection') {
      msg = `[Inspection] ${message}`
    } else {
      msg = message
    }
    return msg
  }
}

module.exports = Logger
