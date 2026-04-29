const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const logger = require('./logger.js');

// Stockage en mémoire des tentatives de connexion par IP
const loginAttempts = new Map();

const MAX_ATTEMPTS = 5;// Nombre max de tentatives autorisées
const BLOCK_TIME = 60 * 1000;// Bloqué 5 minutes

function getIp(req) {//Récupère l'IP
    return (req.headers['x-forwarded-for'] || req.socket.remoteAddress)
        .toString()
        .replace("::ffff:", "");
}

// Route de connexion utilisateur
router.post('/Login', async (req, res) => {
    const { login, pwd } = req.body;
    const pool = req.app.locals.pool;
    let connection;

    const ip = getIp(req);
    const now = Date.now();

    try {
        let attempt = loginAttempts.get(ip);
        // Vérifie si l'IP est déjà bloquée
        if (attempt?.blockUntil && now < attempt.blockUntil) {
            const retryAfter = Math.ceil((attempt.blockUntil - now) / 1000);
            return res.status(429).json({
                message: "Trop de tentatives",
                retryAfter
            });
        }

        //Réinitialise les tentatives si le délai est dépassé
        if (attempt && now - attempt.firstAttempt > BLOCK_TIME) {
            loginAttempts.delete(ip);
        }
        connection = await pool.getConnection();
        //Recherche utilisateur en base
        const users = await connection.query(
            `SELECT * FROM Utilisateur WHERE Email = ?`,
            [login]
        );
        //Si aucun utilisateur trouvé
        if (users.length === 0) {
            registerFailedAttempt(ip, now);
            return res.status(401).send("Email ou mot de passe incorrect");
        }
        
        const user = users[0];
        //Vérification du mot de passe hashé
        const result = await bcrypt.compare(pwd, user.MotDePasse);

        //Si mot de passe incorrect
        if (!result) {
            registerFailedAttempt(ip, now);
            return res.status(401).send("Email ou mot de passe incorrect");
        }

        //Connexion réussie = compteur à 0
        loginAttempts.delete(ip);

        //Création de la session utilisateur
        req.session.logged = true;
        req.session.user = {
            idUtilisateur: user.idUtilisateur,
            nom: user.Nom,
            prenom: user.Prenom,
            email: user.Email,
            role: user.Role
        };

        return res.redirect('/Home');

    } catch (err) {
        console.error(err);
        return res.status(500).send("Erreur serveur");

    } finally {
        // Libération de la connexion SQL
        if (connection) connection.release();
    }
});

// Enregistre une tentative échouée et bloque si trop d'échecs
function registerFailedAttempt(ip, now) {
    const current = loginAttempts.get(ip) || {
        count: 0,
        firstAttempt: now
    };
    // Reset si fenêtre de temps dépassée
    if (now - current.firstAttempt > BLOCK_TIME) {
        current.count = 0;
        current.firstAttempt = now;
    }
    current.count++;
    // Blocage si trop de tentatives
    if (current.count >= MAX_ATTEMPTS) {
        current.blockUntil = now + BLOCK_TIME;
        logger.warn(`IP bloquée : ${ip}`);
    }
    loginAttempts.set(ip, current);
}

// Route de création d'utilisateur
router.post('/NewUtilisateur', async (req, res) => {
    const { Nom, Prenom, Email, MotDePasse } = req.body;
    const pool = req.app.locals.pool;

    // Fonction de création utilisateur
    async function NewUtilisateur(nom, prenom, email, mdp) {
        let connection;
        try {
            const saltRounds = 10;
            // Hash du mot de passe
            const hashMdp = await bcrypt.hash(mdp, saltRounds);
            console.log("Cryptage réussi", hashMdp);
            connection = await pool.getConnection();
            // Insertion en base de données
            await connection.query(
                `INSERT INTO Utilisateur (Nom, Prenom, Email, Role, MotDePasse)
                VALUES (?, ?, ?, ?, ?)`,
                [nom, prenom, email, 'AgentDeRestauration', hashMdp]
            );
            console.log('Data inséré');
        } catch (err) {
            console.error('Erreur', err);
            throw err;
        } finally {
            // Libération connexion SQL
            if (connection) connection.release();
        }
    }
    try {
        await NewUtilisateur(Nom, Prenom, Email, MotDePasse);
        res.redirect('/Home');
    } catch (err) {
        res.status(500).send("Erreur lors de l'affichage de la BDD");
    }
});

module.exports = router;