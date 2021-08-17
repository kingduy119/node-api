
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize, json } = format;

const config = {
    transports: [
        new transports.Console({ format: format.simple() }),
        new transports.File({ 
            filename: 'logs/common.log',
            json: true,
            maxsize: 5242880, //5mb
            maxFiles: 5,
            colorize: false,
        })
    ],
    format: combine(
        json(),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        printf(info => `${info.timestamp} | ${info.level}: ${info.message}`),
    ),
}
  
const logger = createLogger(config);

export default logger;
