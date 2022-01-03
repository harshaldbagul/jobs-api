const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.includes('Bearer ')) {
        throw new BadRequestError('Auth token is missing');
    }
    const token = authorization.replace('Bearer ', '');

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: payload.userId }).select('-password');
        req.user = user;
        next();
    } catch (er) {
        throw new UnauthenticatedError('Invalid token');
    }

}

module.exports = auth;