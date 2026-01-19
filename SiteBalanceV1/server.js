const express = require('express');
const serveur=express()
const morgan = require('morgan');
const { cp } = require('node:fs');
const { join } = require('node:path');
const session = require('express-session');
const mysql = require('mysql2/promise');


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

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'mariadb_user',
//     password: 'mariadb_password',
//     database: 'mariadb_database',
//     port: 3306, // default MariaDB port
// });

//ROUTES##############################################""
serveur.get('/', (req,res) =>{
	console.log("Methode Get");
	res.sendFile(join(__dirname, 'views','Login.html'));
})

serveur.post('/Login', (req, res) => {
    const { login, pwd } = req.body;

    console.log("Login:", login);
    console.log("Password:", pwd);

    if (login == "identifiant" && pwd == "motdepasse") {
		req.session.logged = true;
        res.redirect('/Home');
    } else {
        res.status(401).send("Identifiant ou mot de passe incorrect");
    }
});

serveur.post('/Logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Erreur de déconnexion");
        }
        res.redirect('/');
    });
});


serveur.get('/Home', isAuthenticated, (req, res) => {
    res.sendFile(join(__dirname, 'views', 'Home.html'));
});

serveur.get('/Graphique', isAuthenticated, (req, res) => {
    res.sendFile(join(__dirname, 'views', 'Graphique.html'));
});

serveur.use((req,res,next)=>{
    const error = new Error("Page non trouvée")
    error.status=404;
    res.sendFile(join(__dirname, 'views','Erreur404.html'));
})

serveur.listen(3000);