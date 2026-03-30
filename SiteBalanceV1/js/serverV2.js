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
serveur.use(morgan('dev'));
serveur.use(express.urlencoded({ extended: true }));
serveur.use(express.json());

//Listage des addresse IP Bans et appelle de la fonction vérifiant les ip bannis
const IpBan = async (req, res, next) => {
    const ip = req.ip.replace("::ffff:", "");
    console.log(ip)
    try {
        const banned = await CheckIpBan(ip);
        if (banned) {
            console.log("IP bannie :", ip);
            return res.status(403).send("Tentative de DDOS, IP bannie du site");
        }
        next();
    } catch (err) {
        console.error("Erreur vérification IP :", err);
        next();
    }
};
serveur.use(IpBan);

//Mise en place d'un rate limiter pour empêcher le DDOS appelant la fonction AddIpBan sinon
const testLimiter = rateLimit({
    windowMs: 1000,
    max: 5,
    message: 'Utilisation du rate limiter',
    handler: async (req, res) => {
        const ip = req.ip.replace("::ffff:", "");
        const dateBan = new Date();
        console.log("Rate limit");
        console.log("IP :", ip);
        console.log("Route :", req.originalUrl);
        console.log("Date :", dateBan.toISOString());
        await AddIpBan(ip, dateBan);
        console.log("IP bannie pour DDOS :", ip);
        res.status(403).send("Tentative de DDOS, IP bannie du site");
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
    exec(`kill ${pid}`,(err)=>{
    if(err)
    {
        console.error("Echec du kill");
    }else
    {
        console.log(`Process ${pid} tué`);
    }
    });
}

//Fonction permettant de tuer un processus en entrant son port
function FreePort (port){
    return new Promise((resolve)=>{
    exec(`lsof -ti tcp:${port} -sTCP:LISTEN -n -P`, (err,stdout) => {
    if(stdout){
        console.log("Process sur le port: ",stdout);
        KillProcess(stdout);
        return resolve();
    }
    else{
        console.log(`Port ${port} déjà libre.`)
        return resolve();
       
    }
    });
})
}

//Fonction asynchrone permettant de lancer le serveur
//+ Vérification de la disponibilité du port 3000
async function StartServer(){
    try{
        await(FreePort(3000));
        {
        https.createServer(options, serveur).listen(3000, () => {
        console.log(`Serveur HTTPS sur port 3000`);
        });
    }
    }
    catch (error){
        console.error('Erreur au démarage', error);
    }
}

StartServer();

