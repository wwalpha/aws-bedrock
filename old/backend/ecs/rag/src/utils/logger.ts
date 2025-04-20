import winston, { format, transports } from 'winston';

const loggerLevel = process.env['LOGGER_LEVEL'] ? process.env['LOGGER_LEVEL'] : 'info';

const Logger = winston.createLogger({
  level: loggerLevel,
  format: format.simple(),
  transports: [new transports.Console()],
});

export default Logger;
