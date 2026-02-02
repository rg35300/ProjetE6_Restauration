const express = require('express');
const serveur=express()
const morgan = require('morgan');
const { cp } = require('node:fs');
const { join } = require('node:path');
const session = require('express-session');
const mysql = require('mysql2/promise');
const mariadb = require('mariadb');
const { send } = require('node:process');
const bcrypt = require('bcrypt');


serveur.use(morgan("dev"));
serveur.use(express.urlencoded({ extended: true }));


serveur.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));

function isAuthenticated(req, res, next) {
    if (req.session.logged) {
        next();
    } else {
        res.redirect('/');
    }
}
//BDD FUNCTION #################################################
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'admin',
    password: '#XCHygTdB9j',
    database: 'Restauration',
    port: 3306,
});

async function ReadDataMariaDB(nomTable) {
    let connection;
    try{
        const TableAdmin=['DonneeCollecte','Utilisateur','Balance'];
        
        connection = await pool.getConnection();
        const LigneTable = await connection.query(`SELECT * FROM ${nomTable}`);
        console.clear();
        console.log('Data:', LigneTable);
    }
    catch (error){
        console.error('Erreur', error);
    }
    finally
    {
        if(connection){
            connection.release();
        }
    }
}

async function WriteDataDonneeCollecte(value,type) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO DonneeCollecte (Type, Valeur) VALUES (?, ?)`,[type, value]);
            console.log('Data inséré');
    } catch (err) {
        console.error('Erreur', err);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function WriteUtilisateur(nom, prenom, email, role, mdp) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO Utilisateur (Nom, Prenom, Email, Role, MotDePasse)
             VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, email, role, mdp]
        );
        console.log('Data inséré');
    } catch (err) {
        console.error('Erreur', err);
    } finally {
        if (connection) connection.release();
    }
}

async function NewUtilisateur(nom, prenom, email,mdp) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO Utilisateur (Nom, Prenom, Email,Role,MotDePasse)
             VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, email, 'AgentDeRestauration', mdp]
        );
        console.log('Data inséré');
    } catch (err) {
        console.error('Erreur', err);
    } finally {
        if (connection) connection.release();
    }
}


//ACTIONS SUR LA BDD #######################################################################################
serveur.post('/NewUtilisateur', async (req, res)=>{
    const { Nom,Prenom,Email,MotDePasse}=req.body;
    
    try{
        await NewUtilisateur(Nom,Prenom,Email,MotDePasse);
        res.redirect('/Home');
    }
    catch(err){
        send.status(500).send("Erreur lors de l'affichage de la BDD");
    }
});

serveur.post('/AddDataDonneeCollecte', isAuthenticated, async (req, res)=>{
    const { weight, choice }=req.body;
    console.log("Poid: ", weight);
    console.log("Type de déchet: ", choice);
    
    try{
        await WriteDataDonneeCollecte(weight,choice);
        res.redirect('/Dechet');
    }
    catch(err){
        send.status(500).send("Erreur lors de l'ajout de données à la BDD");
    }
});

serveur.post('/ReadDataBase', isAuthenticated, async (req, res)=>{
    const { nomTable }=req.body;
    console.log("Table: ", nomTable);
    
    try{
        await ReadDataMariaDB(nomTable);
        res.redirect('/BDD');
    }
    catch(err){
        send.status(500).send("Erreur lors de l'affichage de la BDD");
    }
});
serveur.post('/AddUtilisateur', isAuthenticated, async (req, res)=>{
    const { Nom,Prenom,Email,Role,MotDePasse}=req.body;
    
    try{
        await WriteUtilisateur(Nom,Prenom,Email,Role,MotDePasse);
        res.redirect('/BDD');
    }
    catch(err){
        send.status(500).send("Erreur lors de l'affichage de la BDD");
    }
});

serveur.post('/Semaine', isAuthenticated, async (req, res)=>{
    const {date}=req.body;
    try{
        console.log(date);
        res.redirect('/Graphique');
    }
    catch(err){
        send.status(500).send("Erreur lors de la récup de la date");
    }
});

serveur.get('/API/Data_BDD', isAuthenticated, async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { date, type } = req.query;
        const conditions = [];
        const params = [];

        let query = `
            SELECT DateDeCollecte, Valeur
            FROM DonneeCollecte
        `;

        if (type) {
            conditions.push(`Type = ?`);
            params.push(type);
        }

        if (date) {
            conditions.push(`DATE(DateDeCollecte) = ?`);
            params.push(date);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY DateDeCollecte ASC';

        const rows = await connection.query(query, params);

        if(rows.length === 0 && date){
    return res.json([{DateDeCollecte: date, Valeur: 0}]);
}
    res.json(rows);


    } catch (err) {
        console.error("Erreur API DonneeCollecte :", err);
        res.status(500).json({ error: 'Erreur BDD' });
    } finally {
        if (connection) connection.release();
    }
});



//AUTHENTIFICATION ########################################################
function DroitAcces(rolesAutorises) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/');
        }

        const userRole = req.session.user.role;

        if (rolesAutorises.includes(userRole)) {
            next();
        } else {
            res.status(403).send(`
            <script>
                alert("Vous n'avez pas les droits pour accéder à cette page !");
                window.history.back();
            </script>
        `);
    };
    }
}


serveur.post('/Login', async (req, res) => {
    const { login, pwd } = req.body;
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

        if (user.MotDePasse !== pwd) {
            return res.status(401).send("Identifiant ou mot de passe incorrect");
        }

        req.session.logged = true;
        req.session.user = {
            idUtilisateur: user.idUtilisateur,
            nom: user.Nom,
            prenom: user.Prenom,
            email: user.Email,
            role: user.Role
        };

        console.log("Connexion réussie :", req.session.user);
        res.redirect('/Home');

    } catch (err) {
        console.error("Erreur login :", err);
        res.status(500).send("Erreur serveur");
    } finally {
        if (connection) connection.release();
    }
});
//ROUTES###############################################
serveur.get('/', (req,res) =>{
	console.log("Methode Get");
	res.sendFile(join(__dirname, 'views','Login.html'));
})

serveur.get('/Register',(req, res) => {
    res.sendFile(join(__dirname, 'views', 'Register.html'));
});

serveur.post('/Logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Erreur de déconnexion");
        }
        res.redirect('/');
    });
});

serveur.get('/Home', isAuthenticated, DroitAcces(['webadmin','AdminBDD','AgentDeRestauration','ResponsableSelf']),(req, res) => {
    res.sendFile(join(__dirname, 'views', 'Home.html'));
});
serveur.get('/Graphique', isAuthenticated, DroitAcces(['webadmin','ResponsableSelf']),(req, res) => {
    res.sendFile(join(__dirname, 'views', 'Graphique.html'));
});
serveur.get('/BDD', isAuthenticated, DroitAcces(['webadmin','AdminBDD']),(req, res) => {
    res.sendFile(join(__dirname, 'views', 'BDD.html'));
});
serveur.get('/Dechet', isAuthenticated, DroitAcces(['webadmin','ResponsableSelf','AgentDeRestauration']),(req, res) => {
    res.sendFile(join(__dirname, 'views', 'Dechet.html'));
});
serveur.get('/Menu', isAuthenticated, DroitAcces(['webadmin','ResponsableSelf','AgentDeRestauration']),(req, res) => {
    res.sendFile(join(__dirname, 'views', 'Dechet.html'));
});

serveur.use((req,res,next)=>{
    const error = new Error("Page non trouvée")
    error.status=404;
    res.sendFile(join(__dirname, 'views','Erreur404.html'));
})

serveur.listen(3000);