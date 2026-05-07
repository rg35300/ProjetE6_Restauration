import express from 'express';
import logger from './logger.js';
import * as mariadb from 'mariadb';

const router = express.Router();

// Vérif login
function isAuthenticated(req, res, next) {
    if (req.session.logged) {
        next();
    } else {
        res.redirect('/');
    }
}

// Pool
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'admin',
    password: '#XCHygTdB9j',
    database: 'Restauration',
    port: 3306,
});

// Ajout / update menu
async function AjoutDeMenu(type, nom, masse, jour) {
    let connection;
    logger.info("Connexion à la BDD");

    try {
        connection = await pool.getConnection();

        // sécurisation minimale
        type = type?.trim();
        nom = nom?.trim();
        jour = jour?.trim();
        masse = parseFloat(masse) || 0;

        logger.info(`DATA REÇUE => ${nom} | ${type} | ${masse} | ${jour}`);

        const rows = await connection.query(
            `SELECT IdMenu FROM menu WHERE NomPlat = ? AND TypePlat = ? AND Jour = ?`,
            [nom, type, jour]
        );

        if (rows.length > 0) {
            await connection.query(
                `UPDATE menu SET MassePlat = ? WHERE IdMenu = ?`,
                [masse, rows[0].IdMenu]
            );
        } else {
            await connection.query(
                `INSERT INTO menu (NomPlat, TypePlat, MassePlat, Jour) VALUES (?, ?, ?, ?)`,
                [nom, type, masse, jour]
            );
        }

    } catch (err) {
        logger.error("Erreur SQL menu :", err);
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

router.post('/EnvoyerMenu', isAuthenticated, async (req, res) => {
    const data = req.body;
    logger.info("Requête /EnvoyerMenu reçue");
    logger.info(data);
    try {
        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Format invalide (array attendu)" });
        }
        for (const item of data) {
            await AjoutDeMenu(
                item.TypePlat,
                item.NomPlat,
                item.MassePlat,
                item.Jour
            );
        }
        res.status(200).json({ message: "Menus ajoutés!" });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: "Erreur insertion menus" });
    }
});

router.get('/GetMenu', isAuthenticated, async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();

        const rows = await connection.query(`
            SELECT NomPlat, TypePlat, MassePlat
            FROM menu
        `);

        const data = { entrees: [], plats: [], desserts: [] };

        rows.forEach(row => {
            const element = { nom: row.NomPlat, masse: row.MassePlat };

            if (row.TypePlat === 'entree') data.entrees.push(element);
            else if (row.TypePlat === 'plat') data.plats.push(element);
            else if (row.TypePlat === 'dessert') data.desserts.push(element);
        });

        res.json(data);

    } catch (err) {
        logger.error("Erreur GetMenu :", err);
        res.status(500).json({ error: "Erreur serveur" });

    } finally {
        if (connection) connection.release();
    }
});


router.get('/AffichageMenu', isAuthenticated,async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();

        const rows = await connection.query(`
            SELECT 
                NomPlat, 
                TypePlat, 
                Jour, 
                AVG(MassePlat) AS MasseMoyenne
            FROM menu
            GROUP BY NomPlat, TypePlat, Jour
        `);

        const data = {};

        rows.forEach(row => {
            if (!data[row.Jour]) data[row.Jour] = {};

            const element = {
                nom: row.NomPlat,
                masse: parseFloat(row.MasseMoyenne).toFixed(2)
            };

            if (row.TypePlat === 'entree') data[row.Jour].entree = element;
            else if (row.TypePlat === 'plat') data[row.Jour].plat = element;
            else if (row.TypePlat === 'dessert') data[row.Jour].dessert = element;
        });

        res.json(data);

    } catch (err) {
        logger.error("Erreur AffichageMenu :", err);
        res.status(500).json({ error: "Erreur serveur" });

    } finally {
        if (connection) connection.release();
    }
});

export default router;