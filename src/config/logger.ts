import { variables } from '.'
import winston from 'winston'
import moment from 'moment'

interface LoggingInfo {
  level: string
  message: string
}

const enumerateErrorFormat = winston.format((info: LoggingInfo) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }

  return info
})

const customFormat = winston.format.printf(
  (info: LoggingInfo) => ` [${info.level}] - ${moment().format('MM/DD/YYYY, h:mm:ss A')}  ${info.message}`,
)

const logger = winston.createLogger({
  level: variables.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    variables.NODE_ENV === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    customFormat,
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
})

export default logger
