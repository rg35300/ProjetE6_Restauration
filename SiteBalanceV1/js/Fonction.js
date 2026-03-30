// js/bddFunctions.js
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');
const json2csv = require('json2csv');
const fs = require('fs');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'admin',
    password: '#XCHygTdB9j',
    database: 'Restauration',
    port: 3306,

    // ssl: {
    // ca: fs.readFileSync('/etc/mysql/certs/ProjetRestScolaireCA.pem'),
    // servername: '10.160.120.14',
    // rejectUnauthorized: true
    // }
});

// Fonction pour lire une table entière
async function ReadDataMariaDB(nomTable) {
    let connection;
    try {
        connection = await pool.getConnection();
        const result = await connection.query(`SELECT * FROM ${nomTable}`);
        console.clear();
        console.log('Données:', result);
        return result;
    } catch (err) {
        console.error('Erreur ReadDataMariaDB:', err);
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

// Ajouter une donnée collecte
async function WriteDataDonneeCollecte(valeur, type, idBalance) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO DonneeCollecte (TypeDechet, Valeur, idBalance) VALUES (?, ?, ?)`,
            [type, valeur, idBalance]
        );
        console.log('Donnée insérée');
    } catch (err) {
        console.error('Erreur WriteDataDonneeCollecte:', err);
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

// Ajouter un utilisateur (sans hash)
async function WriteUtilisateur(nom, prenom, email, role, mdp) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO Utilisateur (Nom, Prenom, Email, Role, MotDePasse) VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, email, role, mdp]
        );
        console.log('Utilisateur inséré');
    } catch (err) {
        console.error('Erreur WriteUtilisateur:', err);
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

// Ajouter un utilisateur avec mot de passe hashé
async function NewUtilisateur(nom, prenom, email, mdp) {
    const saltRounds = 10;
    const hashMdp = await bcrypt.hash(mdp, saltRounds);
    console.log("Mot de passe hashé", hashMdp);

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO Utilisateur (Nom, Prenom, Email, Role, MotDePasse) VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, email, 'AgentDeRestauration', hashMdp]
        );
        console.log('Utilisateur inséré avec hash');
    } catch (err) {
        console.error('Erreur NewUtilisateur:', err);
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

//Fonction permettant l'insertion d'une Ip dans une ban list
async function AddIpBan(IpBan,DateBan){
    let connection;
    try{
        connection=await pool.getConnection();
        await connection.query(
            `INSERT INTO IP_BAN (Adresse_IP,Date_Ban) VALUES (?,?)`,
            [IpBan,DateBan]
        );
        console.log('Connexion Banni');
    } catch(err){
        console.error(`Echec du ban de ${IpBan}`);
    } finally{
        if (connection) connection.release();
    }
}

//Fonction vérifiant si la connexion est bien banni et appel la fonction unban si +1h depuis ban
async function CheckIpBan(ip) {
    let connection;
    try {
        connection = await pool.getConnection();
        const rows = await connection.query(
            `SELECT Date_Ban FROM IP_BAN WHERE Adresse_IP = ? LIMIT 1`,
            [ip]
        );
        if (!rows || rows.length === 0) {
            return false;
        }
        const heure_ban = rows[0].Date_Ban;
        console.log('Heure de ban:', heure_ban);
        const TempBanni = new Date() - new Date(heure_ban);
        const Variable1Heure = 3600 * 1000;

        if (TempBanni > Variable1Heure) {
            await UnBanIp(ip);
            return false;
        }
        return true;
    } catch (err) {
        console.error(`Echec vérification IP`, err);
        return false;
    } finally {
        if (connection) connection.release();
    }
}

//Fonction d'unban
async function UnBanIp(ip) {
    let connection;
    try {
        connection = await pool.getConnection();
        const result = await connection.query(
            `DELETE FROM IP_BAN WHERE Adresse_IP = ?`,
            [ip]
        );
        console.log(`IP ${ip} débannie, rows affected: ${result.affectedRows}`);
    } catch (err) {
        console.error(`Echec du unban de ${ip}:`, err);
    } finally {
        if (connection) {
            try { connection.release(); } 
            catch (releaseErr) { console.error("Error releasing connection", releaseErr); }
        }
    }
}

module.exports = {
    ReadDataMariaDB,
    WriteDataDonneeCollecte,
    WriteUtilisateur,
    NewUtilisateur,
    CheckIpBan,
    AddIpBan,
    UnBanIp,
    pool,
};
// async function ExportExcsel(date_debut,date_fin,type_dechet){
//     let connection;
//     try{
//         connection = await pool.getConnection();
//         `SELECT FROM DonneeCollecte WHERE `
//     }
// }

//Liste des fonctions importable dans d'autre fichier.
