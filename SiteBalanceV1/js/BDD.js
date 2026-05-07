import express from 'express';
const router = express.Router();
import json2csv from 'json2csv';
import logger from './logger.js';

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
    logger.info("Insértion de donnée de masse dans la BDD");

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

router.get('/ExportCSV', isAuthenticated, async (req, res) => {
    const pool = req.app.locals.pool;
    let connection;
    try {
        connection = await pool.getConnection();
        const rows = await connection.query(
            `SELECT DateDeCollecte, Valeur, TypeDechet FROM DonneeCollecte`
        );

        let csv = 'DateDeCollecte;Valeur;TypeDechet\n';

        rows.forEach(row => {
            const date = row.DateDeCollecte ? row.DateDeCollecte.toISOString().split('T')[0] : '';
            const valeur = row.Valeur ?? '';
            const type = row.TypeDechet ? `"${row.TypeDechet.replace(/"/g, '""')}"` : '';
            csv += `${date};${valeur};${type}\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="Historique_Pesé.csv"');
        res.send(csv);

    } catch (err) {
        console.error("Erreur export CSV :", err);
        res.status(500).json({ error: "Erreur serveur" });
    } finally {
        if (connection) connection.release();
    }
});

export default router;