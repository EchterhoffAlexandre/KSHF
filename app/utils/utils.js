const jwt = require('jsonwebtoken');

const getUserId = (req) => {
    // Je récupère l'userId grâce au token d'authentification
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret-key');
    const userId = decodedToken?.userId ;
    return userId;
}

module.exports = getUserId;