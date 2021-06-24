const TodosController = require('../controllers/todosController')
const authorization = require('../middlewares/authorization')
const todosRouter = require('express').Router()

todosRouter.post('/', TodosController.createTodos)
todosRouter.get('/', TodosController.getTodos)

todosRouter.use('/:id', authorization)
todosRouter.get('/:id', TodosController.getTodoById)
todosRouter.put('/:id', TodosController.putTodoById)
todosRouter.patch('/:id', TodosController.doneTodoById)
todosRouter.delete('/:id', TodosController.deleteTodoById)

module.exports = todosRouter