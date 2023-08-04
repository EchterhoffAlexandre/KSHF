const jwt = require('jsonwebtoken');
const { User } = require('../models');

const tokenMiddleware = async (req, res, next) => {
    // On vérifie que le header Autorization est présent dans la requête
    // De ce que j'ai compris, les en-têtes d'une requête http contiennent des infos 
    // comme les identifians de connexion. Du coup dans headers.authorization, dans notre cas
    // on devrait trouver le token JWT

    if (!req.headers.authorization) {
        return res.status(400).json('Authorization header missing');
    }

    // On récupère le token depuis ce header Authorization
    // On fait un split parce que le header Authorization est constitué du type de token 
    // (souvent c'est "Bearer" puis la valeur du token séparé par un espace)
    const token = req.headers.authorization.split(' ')[1];

    try {
        // On vérifie que le token est valide en le décodant avec notre clé secrète
        const decodedToken = jwt.verify(token, 'secret-key');

        // On ajoute les données décodées dans l'objet req pour les utiliser dans la suite de la requête
        req.userId = decodedToken.userId;

        // On vérifie si l'user a le droit de se connecter
        const user = await User.findByPk(decodedToken.userId);
        if (!user) {
            return res.status(403).json('Forbidden');
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json('Unauthorized');
    }
}

module.exports = tokenMiddleware;