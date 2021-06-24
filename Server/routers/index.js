const express = require('express')
const LogController = require('../controllers/logController')
const authentication = require('../middlewares/authentication')
const todosRouter = require('./todosRouter')
const router = express.Router()

router.post('/register', LogController.register)
router.post('/login', LogController.login)
router.post('/googlelogin', LogController.googleLogin)

router.use( authentication )
router.use('/todos', todosRouter )
module.exports = router