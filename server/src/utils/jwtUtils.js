const jwt = require('jsonwebtoken');

// genrate jwt token

const generateToken = (userId) => {

    return jwt.sign(
        {Id:userId},
        process.env.JWT_SECREAT,
        {
            expiresIn:'7d',
        }
    );
};

module.exports = {
    generateToken,
};