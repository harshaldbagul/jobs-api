const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.getJwtToken();
    res.status(StatusCodes.CREATED).send({ user: { name: user.name }, token });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }
    const passwordMatched = await user.validatePassword(password);
    if (passwordMatched) {
        const token = user.getJwtToken();
        res.status(StatusCodes.OK).send({ user: { name: user.name }, token });
    } else {
        throw new UnauthenticatedError('Invalid credentials');
    }
}


module.exports = {
    register,
    login
};