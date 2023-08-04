const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const Joi = require("joi");

// Schema du mot de passe
const schema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')),
});

const authController = {

    signupUser: async (req, res) => {
        try {
            const { email, firstname, lastname, password, confirmation } = req.body;
            const bodyErrors = [];

            // Test des saisies utilisateurs
            if (!email || !firstname || !lastname || !password || password != confirmation) {
                bodyErrors.push('All fields are required');
            }

            // On vérifie si l'email est déjà prise :
            const user = await User.findOne({ where: {email:email}});
            if(user) {
                bodyErrors.push('Email already used');
            }

            // On vérifie si l'email est conforme : 
            const emailResult = schema.validate({ email: email });
            if (emailResult.error) {
                bodyErrors.push('Invalid email address');
                console.log(emailResult.error.details[0].message) 
            }

            const result = schema.validate({ password: password });
            if (result.error) {
            bodyErrors.push('Invalide password');
            console.log(result.error.details[0].message); // "Mot de passe doit contenir au moins 3 caractères"
            }

            // On vérifie si il y a eu des erreurs
            if ( bodyErrors.length) {
                console.log(bodyErrors);
                res.status(400).json(bodyErrors);
            } else {
                const encodedPassword = bcrypt.hashSync(password, 5);
                let newUser = User.build({      // On crée une instance avec le .build
                    email,
                    firstname,
                    lastname,
                    password:encodedPassword
                });
                await newUser.save();            // On enregistre l'instance crée dans la db
                // TODO! Choix route /login front ou back 
                res.redirect('/login');
                // Dans le JSON qu'on envoie, on retire le password
                res.status(200).json({ newUser: { email, firstname, lastname } });
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    // Méthode pour se logger
    loginUser: async (req, res) => {
        // On récupère les infos soumises dans le body
        console.log(req.body)
        const { email, password } = req.body;

        try {
            // On commence par vérifier que les champs soient bien remplis
            if (!email || !password) {
                return res.status(400).json('All fields are required');
            }

            // Si c'est ok, on vérifie qu'un utilisateur est associé à l'email saisie dans la bdd
            const user = await User.findOne({
                where: { email },
                include: [
                    {association: "budget",
                    include: [
                        {
                            association:"operations"
                        }]},
                    "family",
                    // {association: "friends"},
                    {association: "quests"},
                    // {association: "items_collection"},
                    // {association: "items_shop"}
                ]
            });
            
            const responseWithoutPassword = {...user.dataValues, password:''}
            console.log('responseWithoutPassword',responseWithoutPassword);

            // S'il cet utilisateur n'existe pas
            if (!user) {
                return res.status(401).json('Incorrect email or password');
            }

            // Maintenant on vérifie le mot de passe
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json('Incorrect email or password');
            }

            // Et maintenant on créer et on envoie un token pour l'utilisateur (token d'accès)
            const token = jwt.sign({ userId: user.id }, 'secret-key', { expiresIn: '30m' });
            // Puis un token de rafraichissement, qui va être utilisé pour obtenir un nouveau token d'accès 
            // lorsque le précédent va expirer. Il doit avoir une durée de vie plus longue et peut être utilisé pour
            // renouveler plusieurs fois le token d'accès
            const refreshToken = jwt.sign({ userId: user.id }, 'refresh-secret-key', { expiresIn: '30d' });

            /** AUTRE POSSIBILITE, QUI SUPPRIME CARREMENT LE PASSWORD DU RENVOIE
            const userJson = user.toJSON();
            delete userJson.password;
            res.status(200).json({ token, userJson });
             */

            res.status(200).json({ token, refreshToken, responseWithoutPassword });

        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },


    refreshToken: async (req, res) => {
        // On récupère le token de refresh dans le body
        const refreshToken = req.body.refreshToken;
        console.log(refreshToken)

        // On vérifie que le token de refresh existe, sinon on envoie un code 400 avec un message d'erreur
        if (!refreshToken) {
            return res.status(400).json('Refresh token is required');
        }

        try {
            const decodedRefreshToken = jwt.verify(refreshToken, 'refresh-secret-key');

            // On vérifie que le token est valide et qu'il correspond bien à un utilisateur de la bdd
            const user = await User.findByPk(decodedRefreshToken.userId);
           
            // Si on ne trouve pas d'utilisateur correspondant on envoie un code 401
            if (!user) {
                return res.status(401).json('Invalid refresh token');
            }

            // Sinon on génère un nouveau token d'accès avec par exemple toujours une durée de 30 minutes
            const token = jwt.sign({ userId: user.id }, 'secret-key', { expiresIn: '30m'});

            // On renvoie le nouveau token d'accès au client
            res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            res.status(401).json('error');
        }
    },

    deleteToken: async  (req, res) => {
        // Je vérifie que l'utilisateur est connecté
        console.log(req.session, req.session.user)
        if ( req.session && req.session.user) {
            // Je supprime le token de l'utilisateur 
            delete req.session.user.token
        } else {
            res.redirect('/signup')
        }
    }
}

module.exports = authController;