import logger from './logger.js';
import express from 'express';
const serveur = express();

serveur.set('trust proxy', 1);

import morgan from 'morgan';
import fs from 'fs';
import https from 'https';
import session from 'express-session';
import { exec } from 'child_process';
import * as mariadb from 'mariadb';
import rateLimit from 'express-rate-limit';

import { AddIpBan, CheckIpBan } from './Fonction.js';

import path from 'path'; // ajout pour les chemins
import { fileURLToPath } from 'url'; // ajout pour ES modules

const __dirname = fileURLToPath(new URL('.', import.meta.url)); // remplacement de __dirname en ES modules
serveur.use('/img', express.static(path.join(__dirname, '../img')));//Permet d'aller importer les images


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

    return null;
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


//Rate limiter global propre
const publicLimiter = rateLimit({
    windowMs: 10 * 1000, //Fenêtre courte pour navigation normale
    max: 100, // Permet navigation + images sans ban
    standardHeaders: true,
    legacyHeaders: false
});

serveur.use(publicLimiter); // Appliqué globalement proprement


//Rate limiter strict pour test
const strictLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,

    handler: async (req, res) => {

        const ip = req.ip.replace("::ffff:", "");
        const dateBan = new Date();

        await AddIpBan(ip, dateBan);

        logger.warn('Anti brute-force activé', {
            ip,
            route: req.originalUrl,
            bannedAt: dateBan.toISOString(),
        });

        return res.status(429).send("Trop de requêtes");
    }
});

//Activation globale du strictLimiter pour test
serveur.use(strictLimiter);


//Création d'une session d'authentification
serveur.use(session({
    secret: 'VmDE9XFzHueA1fbbfsAI0eTkrtaeB1GEk91GQ2Uw2NyAha2T6TfXVZSaKp5SQUcz73w1Oz40Yg9IucQvhxlMKn',
    resave: false,
    saveUninitialized: false,

    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 3600 * 1000,
        sameSite: "strict"
    }
}));


//Utilisation des fichiers exterieurs
import routes from './routes.js';
import BDD from './BDD.js';
import graphic from './graphic.js';
import login from './login.js';
import strict from 'assert/strict';

// Ajout des routes (important sinon / ne marche pas)
serveur.use('/', routes); // activation du router principal
serveur.use('/', BDD);

//Utilisaion du certificat avec clé
const options = {
    key: fs.readFileSync(path.join(__dirname, '../Cert/CleRestauration.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../Cert/CertificatRestauration.pem')),
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
            resolve();
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
//Vérification de la disponibilité du port 3000
async function StartServer(){
    try{
        await FreePort(3000);
        https.createServer(options, serveur).listen(3000, () => {
            logger.info('Serveur lancé en HTTPS sur le port 3000 via PM2');
        });

    }
    catch (error){

        console.error('Erreur au démarage', error);
        logger.error('Echec au lancement du serveur');
    }
}
StartServer();