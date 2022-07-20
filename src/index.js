const winston = require('winston');
const pathLog = 'logs';
const path = require('path');
const { createLogger, format } = require('winston');
const { combine, timestamp, label, printf } = format;
const util = require('util');
const LABEL = '!LOGGER!';
const moment = require('moment');
require('winston-daily-rotate-file');

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
const timezone = () => {
    return moment().format('DD-MM-YYYY HH:mm:ss');
};



module.exports = (options) => {
    const logger = createLogger({
        transports: [
            // info console log
            new winston.transports.Console({
                level: 'info',
                name: 'info-console',
                colorize: true,
                format: combine(
                    label({ label: options.service || LABEL }),
                    timestamp({ format: timezone }),
                    myFormat,
                    format.splat()
                )
            }),
            // info log file
            new winston.transports.DailyRotateFile({
                level: 'info',
                name: 'info-file',
                colorize: true,
                format: combine(
                    label({ label: options.service || LABEL }),
                    timestamp({ format: timezone }),
                    myFormat,
                    format.splat()
                ),
                filename: path.join(options.path || pathLog, 'info-%DATE%.log'),
                json: true,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d'
            }),
            // errors console log
            new winston.transports.Console({
                level: 'error',
                name: 'error-console',
                colorize: true,
                format: combine(
                    label({ label: options.service || LABEL }),
                    timestamp({ format: timezone }),
                    myFormat
                )
            }),
            // errors log file
            new winston.transports.DailyRotateFile({
                level: 'error',
                name: 'error-file',
                colorize: true,
                format: combine(
                    label({ label: options.service || LABEL }),
                    timestamp({ format: timezone }),
                    myFormat
                ),
                filename: path.join(options.path || pathLog, 'error-%DATE%.log'),
                json: true,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d'
            })
        ]
    });
    const myLogger = {}
    myLogger.info = (tag, message) => {
        // console.log(tag, message);
        if (message) return logger.info(util.format('%o', tag) + ' ' + util.format('%o', message));
        else return logger.info(util.format('%o', tag));
    };

    myLogger.error = (tag, message) => {
        // console.log(tag, message);
        if (message) return logger.error(util.format('%o', tag) + ' ' + util.format('%o', message));
        else return logger.error(util.format('%o', tag));
    };

    return myLogger;
};
