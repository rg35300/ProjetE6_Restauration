const logger = require('./logger.js');
const express = require('express');
const serveur = express();
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');
const session = require('express-session');
const { join } = require('path');
const { exec } = require('child_process');
const mariadb = require('mariadb');
const rateLimit = require('express-rate-limit');
const { AddIpBan, CheckIpBan} = require('./Fonction.js');




//Utilisation du package.json pour démarer le serveur
serveur.use(morgan((tokens, req, res) => {
    const status = parseInt(tokens.status(req, res));
    const logMessage = `${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} ${tokens['response-time'](req, res)} ms`;

    if (status >= 400) {
        logger.error(logMessage);
    } else if (status >= 300) {
        logger.warn(logMessage);
    } else {
        logger.info(logMessage);
    }

    return null; // empêche Morgan d'écrire dans la console
}));

serveur.use(express.urlencoded({ extended: true }));
serveur.use(express.json());

//Listage des addresse IP Bans et appelle de la fonction vérifiant les ip bannis
const IpBan = async (req, res, next) => {
    const ip = req.ip.replace("::ffff:", "");
    try {
        const banned = await CheckIpBan(ip);
        if (banned) {
            logger.warn(`Tentative d'accès bannie depuis IP : ${ip}`);
            return res.status(403).send("Tentative de DDOS, Banni");
        }

        logger.info(`IP autorisée : ${ip}`);
        next();
    } catch (err) {
        logger.error(`Erreur lors de la vérification de l'IP ${ip} : ${err.message}`);
        next();
    }
};
serveur.use(IpBan);

//Mise en place d'un rate limiter pour empêcher le DDOS appelant la fonction AddIpBan sinon
const testLimiter = rateLimit({
    windowMs: 1000,
    max: 5,
    handler: async (req, res) => {
        const ip = req.ip.replace("::ffff:", "");
        const dateBan = new Date();
        await AddIpBan(ip, dateBan);
        
        logger.warn('Anti-DDOS activé', {
            ip,
            route: req.originalUrl,
            bannedAt: dateBan.toISOString(),
            userAgent: req.get('User-Agent'),
        });
    }
});

serveur.use('/', testLimiter);


//Création d'une session d'authentification
serveur.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpsOnly: true,
        maxAge : 3600 * 1000
    }
}));

//Utilisation des fichiers exterieurs
const routes = require('./routes');
serveur.use('/', routes);
const BDD = require('./BDD');
serveur.use('/', BDD);
const graphic = require('./graphic');
serveur.use('/',graphic);
const login=require('./login');
serveur.use('/',login);


//Utilisaion du certificat avec clé
const options = {
  key: fs.readFileSync('./Cert/CleRestauration.pem'),
  cert: fs.readFileSync('./Cert/CertificatRestauration.pem'),
  passphrase: 'mvF1NxKJZ1'
};



//Connection à la BDD contenu dans le serveur
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'admin',
    password: '#XCHygTdB9j',
    database: 'Restauration',
    port: 3306,
});

serveur.locals.pool = pool;
//Fonction permettant de tuer un processus avec son pid en argument
function KillProcess(pid){
  return new Promise((resolve) => {
    exec(`kill ${pid}`, (err) => {
      if(err) {
        logger.error(`Echec du kill du process ${pid}: ${err.message}`);
      } else {
        const cleanPid = pid.toString().trim();
        logger.info(`Process ${cleanPid} tué`);
      }
      resolve();//Permet de continuer dans le cas où le port 3000 est libre.
    });
  });
}

//Fonction permettant de tuer un processus en entrant son port
function FreePort(port){
  return new Promise((resolve) => {
    exec(`lsof -ti tcp:${port} -sTCP:LISTEN -n -P`, async (err, stdout) => {
      const cleanStdout = stdout?.trim();
      if(cleanStdout){
        const pid = cleanStdout;
        logger.info(`Process sur le port ${port}: ${pid}`);
        await KillProcess(pid);
        resolve();
      } else {
        logger.info(`Port ${port} déjà libre.`);
        resolve();
      }
    });
  });
}

//Fonction asynchrone permettant de lancer le serveur
//+ Vérification de la disponibilité du port 3000
async function StartServer(){
    try{
        await(FreePort(3000));
        {
        https.createServer(options, serveur).listen(3000, () => {
        logger.info('Serveur lancé en HTTPS sur le port 3000');
        });
    }
    }
    catch (error){
        console.error('Erreur au démarage', error);
        logger.error('Echec au lancement du serveur');
    }
}

StartServer();

