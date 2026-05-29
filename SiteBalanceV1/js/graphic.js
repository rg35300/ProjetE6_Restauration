import express from 'express';
import logger from './logger.js';
import { DroitAcces, isAuthenticated } from './routes.js';

const router = express.Router();



import { join } from 'path';

router.get('/Graphique', isAuthenticated, (req, res) => {
    res.sendFile(join(process.cwd(), '../views', 'Graphique.html'));
});

router.get('/API/Data_BDD', isAuthenticated, DroitAcces(['webadmin']),async (req, res) => {
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
            SELECT DATE(DateDeCollecte) as DateDeCollecte, SUM(Valeur) as Valeur
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

        query += ' GROUP BY DATE(DateDeCollecte)';
        query += ' ORDER BY DateDeCollecte ASC';

        const rows = await connection.query(query, params);

        if(rows.length === 0 && date_debut && date_fin){
            return res.json([{DateDeCollecte: date_debut, Valeur: 0}]);
        }
        res.json(rows);


    } catch (err) {
        console.error("Erreur API DonneeCollecte :", err);
        res.status(500).json({ error: 'Erreur BDD' });
        logger.error('Erreur à la libération de la BDD')
    } finally {
        if (connection) connection.release();
        logger.info('Libération de la connexion à la BDD');
    }
});

export default router;