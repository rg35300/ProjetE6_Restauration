const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.session.logged) {
        next();
    } else {
        res.redirect('/');
    }
}

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



router.post('/AddDataDonneeCollecte', isAuthenticated, async (req, res)=>{
    const { weight, choice ,balance}=req.body;
    const idBalance = parseInt(balance, 10);
    const pool = req.app.locals.pool;

    console.log("Poid: ", weight);
    console.log("Type de déchet: ", choice);
    console.log("Balance n°", idBalance)
    
    try{
        let connection;
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO DonneeCollecte (TypeDechet, Valeur,idBalance) VALUES (?, ?, ?)`,[choice, weight,idBalance]);
        res.redirect('/Dechet');
    }
    catch(err){
        res.status(500).send("Erreur lors de l'ajout de données à la BDD");
    }
});

router.post('/ReadDataBase', isAuthenticated, async (req, res)=>{
    const { nomTable }=req.body;
    const pool = req.app.locals.pool;
    console.log("Table: ", nomTable);
    try{
        let connection;
        connection = await pool.getConnection();
        const LigneTable = await connection.query(`SELECT * FROM ${nomTable}`);
        console.clear();
        console.log('Data:', LigneTable);
        res.redirect('/BDD');
    }
    catch(err){
        res.status(500).send("Erreur lors de l'affichage de la BDD");
    }
});

router.post('/AddUtilisateur', isAuthenticated, async (req, res)=>{
    const { Nom,Prenom,Email,Role,MotDePasse}=req.body;
    const pool = req.app.locals.pool;
    try{
        let connection;
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO Utilisateur (Nom, Prenom, Email, Role, MotDePasse)
             VALUES (?, ?, ?, ?, ?)`,
            [Nom,Prenom,Email,Role,MotDePasse]);
        res.redirect('/BDD');
    }
    catch(err){
        res.status(500).send("Erreur lors de l'affichage de la BDD");
    }
});

router.post('/Semaine', isAuthenticated, async (req, res)=>{
    const {date}=req.body;
    try{
        console.log(date);
        res.redirect('/Graphique');
    }
    catch(err){
        res.status(500).send("Erreur lors de la récup de la date");
    }
});

module.exports = router;