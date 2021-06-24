const {Todo} = require('../models/index.js')

async function authorization (req, res, next){
    try {
        const idToFind = +req.params.id
        let foundTodo = await Todo.findByPk(idToFind)
        if (foundTodo) {
            if (foundTodo.UserId === req.activeUser.id) {
                next()
            } else {
                next({name: "Authorization Error", message: "You are not authorized"})
                // throw {status:401, message:'You are not authorized'}
            }
        } else {
            next({name: "Not Found", message: `Data with id ${idToFind} not found`})
            // throw {status:404, message:'Not Found'}
        }
    } catch (err) {
        next(err)
        // const statusCode = err.status || 500;
        // const message = err.message || 'unkown error'
        // res.status(statusCode).json(message)
    }
    

}

module.exports = authorization