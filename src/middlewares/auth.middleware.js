const jwt = require('jsonwebtoken');
const { env } = require('../config/env.config');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Accesso negado!');

    try {
        const verified = jwt.verify(token.split(' ')[1], env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Token não validado!');
    }
};

const authorize = (requiredType) => {
    return (req, res, next) => {
        if (req.user.user_type !== requiredType) {
        return res.status(403).send('O usuário não é permitido a acessar essa rota!');
        }
        next();
    };
};

const authorizeStudentOrSelf = (req, res, next) => {
    const { id } = req.params;
    if (req.user.user_type !== 'Teacher' && req.user.user_id !== parseInt(id, 10)) {
        return res.status(403).send('O usuário não é permitido a acessar essa rota!');
    }
    next();
};
  
module.exports = { authenticate, authorize, authorizeStudentOrSelf };