const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.session.logged) {
        console.log("Token Graphique");
        next();
    } else {
        res.redirect('/');
    }
}

router.get('/Graphique', isAuthenticated, (req, res) => {
    res.sendFile(require('path').join(__dirname, '../views', 'Graphique.html'));
});

router.get('/API/Data_BDD', isAuthenticated, async (req, res) => {
    let connection;
    const pool = req.app.locals.pool;
    try {
        connection = await pool.getConnection();
        const { date_debut,date_fin, type } = req.query;
        const conditions = [];
        const params = [];
        let debut = date_debut && date_debut.trim() !== "" ? date_debut : null;
        let fin = date_fin && date_fin.trim() !== "" ? date_fin : null;

        let query = `
            SELECT DateDeCollecte, Valeur
            FROM DonneeCollecte
        `;

        if (type) {
            conditions.push(`TypeDechet = ?`);
            params.push(type);
        }

        if(date_debut && (date_fin==="")){
            conditions.push(`DATE(DateDeCollecte)BETWEEN ? AND ?`);
            params.push(debut, debut);
        }

        if(date_fin && (date_debut==="")){
            conditions.push(`DATE(DateDeCollecte)BETWEEN ? AND ?`);
            params.push(fin, fin);
        }

        if (date_debut && date_fin) {
            if(date_debut>date_fin){
                let temp=debut;
                debut=fin;
                fin=temp;
            }
            conditions.push(`DATE(DateDeCollecte)BETWEEN ? AND ?`);
            params.push(debut, fin);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY DateDeCollecte ASC';

        const rows = await connection.query(query, params);

        if(rows.length === 0 && date_debut && date_fin){
            return res.json([{DateDeCollecte: date_debut, Valeur: 0}]);
        }
        res.json(rows);


    } catch (err) {
        console.error("Erreur API DonneeCollecte :", err);
        res.status(500).json({ error: 'Erreur BDD' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;