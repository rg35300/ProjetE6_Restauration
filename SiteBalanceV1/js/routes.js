import express from 'express';
import { join } from 'path';

import menuRoutes from './menu.js';
import loginRoutes from './login.js';
import graphicRoutes from './graphic.js';
import BDDRoutes from './BDD.js';

import rateLimit from 'express-rate-limit';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const router = express.Router();

//Limiter global pour éviter spam refresh / navigation
const pageLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120, // navigation normale + assets
    standardHeaders: true,
    legacyHeaders: false
});


//Fonction vérifiant si l'utilisateur est bien log
function isAuthenticated(req, res, next) {
    if (req.session.logged) {
        next();
    } else {
        res.redirect('/');
    }
}

//Fonction vérifiant si le role de l'utilisateur connecté est bien inclu dans la liste
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
        }
    };
}


//Routage login
router.get('/', pageLimiter, (req,res) =>{
    res.sendFile(join(__dirname, '../views','Login.html'));
})

router.get('/Register', pageLimiter, (req, res) => {
    res.sendFile(join(__dirname, '../views', 'Register.html'));
});

router.post('/Logout', pageLimiter, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Erreur de déconnexion");
        }
        res.redirect('/');
    });
});


//Pages protégées
router.get('/Home', pageLimiter, isAuthenticated, DroitAcces(['webadmin','AdminBDD','AgentDeRestauration','ResponsableSelf']), (req, res) => {
    res.sendFile(join(__dirname, '../views', 'Home.html'));
});

router.get('/Graphique', pageLimiter, isAuthenticated, DroitAcces(['webadmin','ResponsableSelf']), (req, res) => {
    res.sendFile(join(__dirname, '../views', 'Graphique.html'));
});

router.get('/BDD', pageLimiter, isAuthenticated, DroitAcces(['webadmin','AdminBDD']), (req, res) => {
    res.sendFile(join(__dirname, '../views', 'BDD.html'));
});

router.get('/Dechet', pageLimiter, isAuthenticated, DroitAcces(['webadmin','ResponsableSelf','AgentDeRestauration']), (req, res) => {
    res.sendFile(join(__dirname, '../views', 'Dechet.html'));
});

router.get('/Menu', pageLimiter, isAuthenticated, DroitAcces(['webadmin','ResponsableSelf']), (req, res) => {
    res.sendFile(join(__dirname, '../views', 'Menu.html'));
});


//API routes (pas forcément besoin de limiter fort ici)
router.use(menuRoutes);
router.use(loginRoutes);
router.use(graphicRoutes);
router.use(BDDRoutes);


//404
router.use((req,res,next)=>{
    res.status(404).sendFile(join(__dirname, '../views','Erreur404.html'));
});

export {
    router,
    isAuthenticated,
    DroitAcces
};

export default router;