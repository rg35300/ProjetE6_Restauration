// const express = require('express');
// const serveur=express()
// const morgan = require('morgan');
// const { cp } = require('node:fs');
// const { join } = require('node:path');
// const session = require('express-session');
// const mysql = require('mysql2/promise');
// const mariadb = require('mariadb');
// const { send } = require('node:process');
// const bcrypt = require('bcrypt');
// serveur.use(morgan("dev"));

// //HTTPS Et reconnaissance du certificat ################################################
// const https = require('https');
// serveur.use(express.urlencoded({ extended: true }));
// serveur.use(express.json());
// const fs = require('fs');
// const { exec } = require('node:child_process');

// const options = {
//   key: fs.readFileSync('./Cert/CleRestauration.pem'),
//   cert: fs.readFileSync('./Cert/CertificatRestauration.pem'),
//   passphrase: 'mvF1NxKJZ1'
  
// };

// function KillProcess(pid){
//     exec(`kill ${pid}`,(err)=>{
//     if(err)
//     {
//         console.error("Echec du kill");
//     }else
//     {
//         console.log(`Process ${pid} tué`);
//     }
//     });
// }

// function FreePort (port){
//     return new Promise((resolve,reject)=>{
//     exec(`lsof -ti tcp:${port} -sTCP:LISTEN -n -P`, (err,stdout) => {
//     if(stdout){
//         console.log("Process sur le port: ",stdout);
//         KillProcess(stdout);
//         return resolve();
//     }
//     else{
//         console.log(`Port ${port} déjà libre.`)
//         return resolve();
       
//     }
//     });
// })

// }
// async function StartServer(){
//     try{
//         await(FreePort(3000));
//         {
//         https.createServer(options, serveur).listen(3000, () => {
//         console.log(`Serveur HTTPS sur port 3000`);
//         });
//     }
//     }
//     catch (error){
//         console.error('Erreur au démarage', error);
//     }
// }
// StartServer();

// // Création de session ########################################################
// serveur.use(session({
//     secret: 'my-secret-key',
//     resave: false,
//     saveUninitialized: false
// }));

// function isAuthenticated(req, res, next) {
//     if (req.session.logged) {
//         next();
//     } else {
//         res.redirect('/');
//     }
// }
// //BDD FUNCTION #################################################
// const pool = mariadb.createPool({
//     host: 'localhost',
//     user: 'admin',
//     password: '#XCHygTdB9j',
//     database: 'Restauration',
//     port: 3306,
// });

// async function ReadDataMariaDB(nomTable) {
//     let connection;
//     try{
//         const TableAdmin=['DonneeCollecte','Utilisateur','Balance','menu'];
        
//         connection = await pool.getConnection();
//         const LigneTable = await connection.query(`SELECT * FROM ${nomTable}`);
//         console.clear();
//         console.log('Data:', LigneTable);
//     }
//     catch (error){
//         console.error('Erreur', error);
//     }
//     finally
//     {
//         if(connection){
//             connection.release();
//         }
//     }
// }

// async function WriteDataDonneeCollecte(value,type,idBalance) {
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         await connection.query(
//             `INSERT INTO DonneeCollecte (TypeDechet, Valeur,idBalance) VALUES (?, ?, ?)`,[type, value,idBalance]);
//             console.log('Data inséré');
//     } catch (err) {
//         console.error('Erreur', err);
//     } finally {
//         if (connection) {
//             connection.release();
//         }
//     }
// }

// async function WriteUtilisateur(nom, prenom, email, role, mdp) {
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         await connection.query(
//             `INSERT INTO Utilisateur (Nom, Prenom, Email, Role, MotDePasse)
//              VALUES (?, ?, ?, ?, ?)`,
//             [nom, prenom, email, role, mdp]
//         );
//         console.log('Data inséré');
//     } catch (err) {
//         console.error('Erreur', err);
//     } finally {
//         if (connection) connection.release();
//     }
// }

// async function NewUtilisateur(nom, prenom, email,mdp) {
//     let connection;
//     try {
//         const saltRounds=10;
//         const hashMdp=await bcrypt.hash(mdp, saltRounds);
//         console.log("Cryptage réussi", hashMdp);


//         connection = await pool.getConnection();
//         await connection.query(
//             `INSERT INTO Utilisateur (Nom, Prenom, Email,Role,MotDePasse)
//              VALUES (?, ?, ?, ?, ?)`,
//             [nom, prenom, email, 'AgentDeRestauration', hashMdp]
//         );
//         console.log('Data inséré');
//     } catch (err) {
//         console.error('Erreur', err);
//     } finally {
//         if (connection) connection.release();
//     }
// }
// //MENU ET REF DE POID #######################################################################################
// async function AjoutDeMenu(type, nom, masse, jour) {
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         await connection.query(
//             `INSERT INTO menu (NomPlat, TypePlat, MassePlat, Jour)
//              VALUES (?, ?, ?)
//              ON DUPLICATE KEY UPDATE MassePlat = VALUES(MassePlat)`,
//             [nom, type, masse, jour]
//         );
//     } catch (err) {
//         console.error("Erreur lors de l'insertion du menu :", err);
//         throw err;
//     } finally {
//         if (connection) connection.release();
//     }
// }


// serveur.post('/AjoutMenu', async (req, res) => {
//     const { entrees, plats, desserts } = req.body;
//     const today = new Date().toISOString().slice(0, 10);

//     try {
//         console.log("Menus :", JSON.stringify(req.body, null, 2));

//         for (const entree of entrees) {
//             await AjoutDeMenu('entree', entree.nom, entree.organique, today);
//         }

//         for (const plat of plats) {
//             await AjoutDeMenu('plat', plat.nom, plat.organique, today);
//         }

//         for (const dessert of desserts) {
//             await AjoutDeMenu('dessert', dessert.nom, dessert.organique, today);
//         }

//         res.status(200).send("Menus ajoutés!");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Erreur lors de l'insertion des menus");
//     }
// });


// serveur.get('/GetMenu', async (req, res) => {
//     let connection;

//     try {
//         connection = await pool.getConnection();

//         const rows = await connection.query(`
//             SELECT NomPlat, TypePlat, MassePlat
//             FROM menu
//         `);

//         const data = {
//             entrees: [],
//             plats: [],
//             desserts: []
//         };

//         rows.forEach(row => {

//             const element = {
//                 nom: row.NomPlat,
//                 masse: row.MassePlat
//             };

//             if (row.TypePlat === 'entree') {
//                 data.entrees.push(element);
//             }
//             else if (row.TypePlat === 'plat') {
//                 data.plats.push(element);
//             }
//             else if (row.TypePlat === 'dessert') {
//                 data.desserts.push(element);
//             }
//         });

//         res.json(data);

//     } catch (err) {
//         console.error("Erreur récupération menu :", err);
//         res.status(500).json({ error: "Erreur serveur" });

//     } finally {
//         if (connection) connection.release();
//     }
// });

// serveur.get('/AffichageMenu', async (req, res) => {
//     let connection;

//     try {
//         connection = await pool.getConnection();


//         const rows = await connection.query(`
//             SELECT NomPlat, TypePlat, Jour, MassePlat
//             FROM menu m1
//             WHERE IdMenu = (
//                 SELECT MAX(IdMenu)
//                 FROM menu m2
//                 WHERE m2.TypePlat = m1.TypePlat
//                   AND m2.Jour = m1.Jour
//             )
//         `);

//         const data = {};

//         rows.forEach(row => {
//             if (!data[row.Jour]) data[row.Jour] = {};

//             if (row.TypePlat === 'entree') {
//                 data[row.Jour].entree = { nom: row.NomPlat, masse: row.MassePlat };
//             } else if (row.TypePlat === 'plat') {
//                 data[row.Jour].plat = { nom: row.NomPlat, masse: row.MassePlat };
//             } else if (row.TypePlat === 'dessert') {
//                 data[row.Jour].dessert = { nom: row.NomPlat, masse: row.MassePlat };
//             }
//         });

//         res.json(data);

//     } catch (err) {
//         console.error("Erreur récupération affichage :", err);
//         res.status(500).json({ error: "Erreur serveur" });
//     } finally {
//         if (connection) connection.release();
//     }
// });






// //ACTIONS SUR LA BDD #######################################################################################
// serveur.post('/NewUtilisateur', async (req, res)=>{
//     const { Nom,Prenom,Email,MotDePasse}=req.body;
    
//     try{
//         await NewUtilisateur(Nom,Prenom,Email,MotDePasse);
//         res.redirect('/Home');
//     }
//     catch(err){
//         send.status(500).send("Erreur lors de l'affichage de la BDD");
//     }
// });

// serveur.post('/AddDataDonneeCollecte', isAuthenticated, async (req, res)=>{
//     const { weight, choice ,balance}=req.body;
//     const idBalance = parseInt(balance, 10);

//     console.log("Poid: ", weight);
//     console.log("Type de déchet: ", choice);
//     console.log("Balance n°", idBalance)
    
//     try{
//         await WriteDataDonneeCollecte(weight,choice,idBalance);
//         res.redirect('/Dechet');
//     }
//     catch(err){
//         send.status(500).send("Erreur lors de l'ajout de données à la BDD");
//     }
// });

// serveur.post('/ReadDataBase', isAuthenticated, async (req, res)=>{
//     const { nomTable }=req.body;
//     console.log("Table: ", nomTable);
    
//     try{
//         await ReadDataMariaDB(nomTable);
//         res.redirect('/BDD');
//     }
//     catch(err){
//         send.status(500).send("Erreur lors de l'affichage de la BDD");
//     }
// });
// serveur.post('/AddUtilisateur', isAuthenticated, async (req, res)=>{
//     const { Nom,Prenom,Email,Role,MotDePasse}=req.body;
    
//     try{
//         await WriteUtilisateur(Nom,Prenom,Email,Role,MotDePasse);
//         res.redirect('/BDD');
//     }
//     catch(err){
//         send.status(500).send("Erreur lors de l'affichage de la BDD");
//     }
// });

// serveur.post('/Semaine', isAuthenticated, async (req, res)=>{
//     const {date}=req.body;
//     try{
//         console.log(date);
//         res.redirect('/Graphique');
//     }
//     catch(err){
//         send.status(500).send("Erreur lors de la récup de la date");
//     }
// });
// //API Pour la courbe sur la page graphique #############################################################
// serveur.get('/API/Data_BDD', isAuthenticated, async (req, res) => {
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         const { date_debut,date_fin, type } = req.query;
//         const conditions = [];
//         const params = [];
//         let debut = date_debut && date_debut.trim() !== "" ? date_debut : null;
//         let fin = date_fin && date_fin.trim() !== "" ? date_fin : null;

//         let query = `
//             SELECT DateDeCollecte, Valeur
//             FROM DonneeCollecte
//         `;

//         if (type) {
//             conditions.push(`TypeDechet = ?`);
//             params.push(type);
//         }

//         if(date_debut && (date_fin==="")){
//             conditions.push(`DATE(DateDeCollecte)BETWEEN ? AND ?`);
//             params.push(debut, debut);
//         }

//         if(date_fin && (date_debut==="")){
//             conditions.push(`DATE(DateDeCollecte)BETWEEN ? AND ?`);
//             params.push(fin, fin);
//         }

//         if (date_debut && date_fin) {
//             if(date_debut>date_fin){
//                 let temp=debut;
//                 debut=fin;
//                 fin=temp;
//             }
//             conditions.push(`DATE(DateDeCollecte)BETWEEN ? AND ?`);
//             params.push(debut, fin);
//         }

//         if (conditions.length > 0) {
//             query += ' WHERE ' + conditions.join(' AND ');
//         }

//         query += ' ORDER BY DateDeCollecte ASC';

//         const rows = await connection.query(query, params);

//         if(rows.length === 0 && date_debut && date_fin){
//     return res.json([{DateDeCollecte: date_debut, Valeur: 0}]);
// }
//     res.json(rows);


//     } catch (err) {
//         console.error("Erreur API DonneeCollecte :", err);
//         res.status(500).json({ error: 'Erreur BDD' });
//     } finally {
//         if (connection) connection.release();
//     }
// });



// //AUTHENTIFICATION ########################################################
// function DroitAcces(rolesAutorises) {
//     return (req, res, next) => {
//         if (!req.session.user) {
//             return res.redirect('/');
//         }

//         const userRole = req.session.user.role;

//         if (rolesAutorises.includes(userRole)) {
//             next();
//         } else {
//             res.status(403).send(`
//             <script>
//                 alert("Vous n'avez pas les droits pour accéder à cette page !");
//                 window.history.back();
//             </script>
//         `);
//     };
//     }
// }


// serveur.post('/Login', async (req, res) => {
//     const { login, pwd } = req.body;
//     let connection;

//     try {
//         connection = await pool.getConnection();

//         const users = await connection.query(
//             `SELECT * FROM Utilisateur WHERE Email = ?`,
//             [login]
//         );

//         if (users.length === 0) {
//             return res.status(401).send("Identifiant ou mot de passe incorrect");
//         }

//         const user = users[0];

//         bcrypt.compare(pwd,user.MotDePasse,(err,resultat)=>{
//             if(resultat){
//                 req.session.logged = true;
//                 req.session.user = {
//                     idUtilisateur: user.idUtilisateur,
//                     nom: user.Nom,
//                     prenom: user.Prenom,
//                     email: user.Email,
//                     role: user.Role
//                 };  
//             }
//             else{
//                 return res.status(401).send("Identifiant ou mot de passe incorrect");
//             }

//         console.log("Connexion réussie :", req.session.user);
//         res.redirect('/Home');
//         });

//     } catch (err) {
//         console.error("Erreur login :", err);
//         res.status(500).send("Erreur serveur");
//     } finally {
//         if (connection) connection.release();
//     }
// });
// //ROUTES###############################################
// serveur.get('/', (req,res) =>{
// 	console.log("Methode Get");
// 	res.sendFile(join(__dirname, 'views','Login.html'));
// })

// serveur.get('/Register',(req, res) => {
//     res.sendFile(join(__dirname, 'views', 'Register.html'));
// });

// serveur.post('/Logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).send("Erreur de déconnexion");
//         }
//         res.redirect('/');
//     });
// });

// serveur.get('/Home', isAuthenticated, DroitAcces(['webadmin','AdminBDD','AgentDeRestauration','ResponsableSelf']),(req, res) => {
//     res.sendFile(join(__dirname, 'views', 'Home.html'));
// });
// serveur.get('/Graphique', isAuthenticated, DroitAcces(['webadmin','ResponsableSelf']),(req, res) => {
//     res.sendFile(join(__dirname, 'views', 'Graphique.html'));
// });
// serveur.get('/BDD', isAuthenticated, DroitAcces(['webadmin','AdminBDD']),(req, res) => {
//     res.sendFile(join(__dirname, 'views', 'BDD.html'));
// });
// serveur.get('/Dechet', isAuthenticated, DroitAcces(['webadmin','ResponsableSelf','AgentDeRestauration']),(req, res) => {
//     res.sendFile(join(__dirname, 'views', 'Dechet.html'));
// });
// serveur.get('/Menu', isAuthenticated, DroitAcces(['webadmin','ResponsableSelf']),(req, res) => {
//     res.sendFile(join(__dirname, 'views', 'Menu.html'));
// });
// serveur.get('/Affichage',(req, res) => {
//     res.sendFile(join(__dirname, 'views', 'AffichageMenu.html'));
// });

// serveur.use((req,res,next)=>{
//     const error = new Error("Page non trouvée")
//     error.status=404;
//     res.sendFile(join(__dirname, 'views','Erreur404.html'));
// })