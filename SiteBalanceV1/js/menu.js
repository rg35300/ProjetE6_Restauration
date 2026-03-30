const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.session.logged) {
        next();
    } else {
        res.redirect('/');
    }
}

const pool = require('mariadb').createPool({
    host: 'localhost',
    user: 'admin',
    password: '#XCHygTdB9j',
    database: 'Restauration',
    port: 3306,
});

async function AjoutDeMenu(type, nom, masse, jour) {
    let connection;
    try {
        connection = await pool.getConnection();

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
        console.error("Erreur lors de l'insertion du menu :", err);
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

router.post('/AjoutMenu', isAuthenticated, async (req, res) => {
    const { entrees, plats, desserts } = req.body;

    try {
        for (const entree of entrees) {
            await AjoutDeMenu('entree', entree.nom, entree.organique, entree.jour);
        }
        for (const plat of plats) {
            await AjoutDeMenu('plat', plat.nom, plat.organique, plat.jour);
        }
        for (const dessert of desserts) {
            await AjoutDeMenu('dessert', dessert.nom, dessert.organique, dessert.jour);
        }
        res.status(200).send("Menus ajoutés!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'insertion des menus");
    }
});

router.get('/GetMenu',isAuthenticated, async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const rows = await connection.query(`
            SELECT NomPlat, TypePlat, MassePlat
            FROM menu
        `);
        const data = {entrees:[],plats:[],desserts:[]};

        rows.forEach(row => {
            const element = {nom: row.NomPlat,masse: row.MassePlat};
            if (row.TypePlat === 'entree') {
                data.entrees.push(element);
            }
            else if (row.TypePlat === 'plat') {
                data.plats.push(element);
            }
            else if (row.TypePlat === 'dessert') {
                data.desserts.push(element);
            }
        });

        res.json(data);

    } catch (err) {
        console.error("Erreur récupération menu :", err);
        res.status(500).json({ error: "Erreur serveur" });

    } finally {
        if (connection) connection.release();
    }
});

router.get('/AffichageMenu', async (req, res) => {
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

            if (row.TypePlat === 'entree') {
                data[row.Jour].entree = element;
            } else if (row.TypePlat === 'plat') {
                data[row.Jour].plat = element;
            } else if (row.TypePlat === 'dessert') {
                data[row.Jour].dessert = element;
            }
        });

        res.json(data);

    } catch (err) {
        console.error("Erreur récupération affichage :", err);
        res.status(500).json({ error: "Erreur serveur" });
    } finally {
        if (connection) connection.release();
    }
});
module.exports = router;