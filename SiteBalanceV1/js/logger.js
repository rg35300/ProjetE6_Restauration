const winston = require('winston');

const levelCodes = {
  error: 501,
  warn: 400,
  info: 200,
  debug: 100,
};

const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    
     winston.format((info) => {
      info.code = levelCodes[info.level] ?? 0;
      return info;
    })(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),//Affichage Console
    new winston.transports.File({ filename: 'logs/historique.log' }),//Affichage fichier
  ],
});

module.exports = logger;