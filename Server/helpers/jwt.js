const jwt = require('jsonwebtoken');
const PRIVATE_KEY = process.env.PRIVATE_KEY;

function sign(payload){
    return jwt.sign(payload, PRIVATE_KEY)
}

function verify(token){
    return jwt.verify(token, PRIVATE_KEY)
}

module.exports = {sign, verify}