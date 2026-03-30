const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');

router.post('/Login', async (req, res) => {
    const { login, pwd } = req.body;
    const pool = req.app.locals.pool;
    let connection;

    try {
        connection = await pool.getConnection();

        const users = await connection.query(
            `SELECT * FROM Utilisateur WHERE Email = ?`,
            [login]
        );

        if (users.length === 0) {
            return res.status(401).send("Identifiant ou mot de passe incorrect");
        }

        const user = users[0];

        bcrypt.compare(pwd,user.MotDePasse,(err,resultat)=>{
            if(resultat){
                req.session.logged = true;
                req.session.user = {
                    idUtilisateur: user.idUtilisateur,
                    nom: user.Nom,
                    prenom: user.Prenom,
                    email: user.Email,
                    role: user.Role
                };
            }
            else{
                return res.status(401).send("Identifiant ou mot de passe incorrect");
            }

            console.log("Connexion réussie :", req.session.user);
            res.redirect('/Home');
        });

    } catch (err) {
        console.error("Erreur login :", err);
        res.status(500).send("Erreur serveur");
    } finally {
        if (connection) connection.release();
    }
});

router.post('/NewUtilisateur', async (req, res) => {
    const { Nom, Prenom, Email, MotDePasse } = req.body;
    const pool = req.app.locals.pool;

    async function NewUtilisateur(nom, prenom, email, mdp) {
        let connection;
        try {
            const saltRounds=10;
            const hashMdp=await bcrypt.hash(mdp, saltRounds);
            console.log("Cryptage réussi", hashMdp);

            connection = await pool.getConnection();
            await connection.query(
                `INSERT INTO Utilisateur (Nom, Prenom, Email,Role,MotDePasse)
                VALUES (?, ?, ?, ?, ?)`,
                [nom, prenom, email, 'AgentDeRestauration', hashMdp]
            );
            console.log('Data inséré');
        } catch (err) {
            console.error('Erreur', err);
            throw err;
        } finally {
            if (connection) connection.release();
        }
    }

    try {
        await NewUtilisateur(Nom, Prenom, Email, MotDePasse);
        res.redirect('/Home');
    } catch(err) {
        res.status(500).send("Erreur lors de l'affichage de la BDD");
    }
});

module.exports = router;