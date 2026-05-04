const express = require('express');
const router = express.Router();
const { join } = require('path');

const menuRoutes = require('./menu');
const loginRoutes = require('./login');
const graphicRoutes = require('./graphic');
const BDDRoutes = require('./BDD');

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
    };
    }
}




//Routage entre les pages de logins et la déconnection
router.get('/', (req,res) =>{
	res.sendFile(join(__dirname, '../views','Login.html'));
})

router.get('/Register',(req, res) => {
    res.sendFile(join(__dirname, '../views', 'Register.html'));
});

router.post('/Logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Erreur de déconnexion");
        }
        res.redirect('/');
    });
});

//Routage entre les pages

router.get('/Home', isAuthenticated, DroitAcces(['webadmin','AdminBDD','AgentDeRestauration','ResponsableSelf']), (req, res) => {
    res.sendFile(join(__dirname, '../views', 'Home.html'));
});

router.get('/Graphique', isAuthenticated, DroitAcces(['webadmin','ResponsableSelf']), (req, res) => {
    res.sendFile(join(__dirname, '../views', 'Graphique.html'));
});

router.get('/BDD', isAuthenticated, DroitAcces(['webadmin','AdminBDD']), (req, res) => {
    res.sendFile(join(__dirname, '../views', 'BDD.html'));
});

router.get('/Dechet', isAuthenticated, DroitAcces(['webadmin','ResponsableSelf','AgentDeRestauration']), (req, res) => {
    res.sendFile(join(__dirname, '../views', 'Dechet.html'));
});

router.get('/Menu', isAuthenticated, DroitAcces(['webadmin','ResponsableSelf']), (req, res) => {
    res.sendFile(join(__dirname, '../views', 'Menu.html'));
});

router.use(menuRoutes);
router.use(loginRoutes);
router.use(graphicRoutes);
router.use(BDDRoutes);

// 404
router.use((req,res,next)=>{
    const error = new Error("Page non trouvée")
    error.status=404;
    res.status(404).sendFile(join(__dirname, '../views','Erreur404.html'));
})

module.exports = [
    router,
    isAuthenticated,
    DroitAcces
];