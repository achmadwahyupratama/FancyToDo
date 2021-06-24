const { verify } = require("../helpers/jwt.js");
const {User} = require('../models/index.js')

async function authentication (req, res, next){
    try {
        const decodedToken = verify(req.headers.access_token)
        let foundUser = await User.findByPk(decodedToken.id)
        if (foundUser) {
            req.activeUser = {id : decodedToken.id, email: decodedToken.email}
            next()
        } else {
            next({name:'Invalid access token'})
            // throw {status:403, message:'Invalid access token'}
        }
    } catch (err) {
        next(err)
        // const statusCode = err.status || 500;
        // const message = err.message || 'unkown error'
        // res.status(statusCode).json(message)
    }
    
}

module.exports = authentication