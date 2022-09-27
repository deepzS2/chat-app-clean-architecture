import expressWinston from 'express-winston'
import winston, { LoggerOptions } from 'winston'

import { ENV } from '../config'

const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.message, stack: info.stack })
	}

	return info
})

const options: LoggerOptions = {
	level: ENV === 'development' ? 'debug' : 'info',
	format: winston.format.combine(
		enumerateErrorFormat(),
		winston.format.colorize(),
		winston.format.splat(),
		winston.format.printf(({ level, message }) => `${level}: ${message}`)
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json()
			),
		}),
		new winston.transports.File({
			filename: 'logs/combined.log',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json()
			),
		}),
	],
	exitOnError: false,
}

export const logger = winston.createLogger(options)
export const expressLogger = expressWinston.logger({
	...options,
	transports: options.transports as winston.transport[],
	meta: true,
	expressFormat: true,
	colorize: true,
})
export const expressErrorLogger = expressWinston.errorLogger({
	...options,
	transports: options.transports as winston.transport[],
	meta: true,
})
