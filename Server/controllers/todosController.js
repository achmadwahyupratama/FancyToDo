const {Todo} = require('../models')
const axios = require('axios')
// const apiId = process.env.PRIVATE_KEY;
const apiId = `e3720bceea330024d5f56456d226408f`

class TodosController{
    static createTodos(req, res, next){
        let newTodo = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date,
            UserId: req.activeUser.id,
            location: req.body.location
        }
        Todo.create(newTodo)
            .then((data)=>{
                res.status(201).json(data)
            })
            .catch((err)=>{
                next(err)
                // if(err.name === `SequelizeValidationError`){
                //     let errs = []
                //     err.errors.forEach(element => {
                //         errs.push({message: element.message})
                //     });
                //     res.status(400).json({errors: errs})
                // } else {
                //     next(err)
                //     console.log(err);
                //     res.status(500).json({errors: {message: err.message}})
                // }
            })
    }

    static getTodos(req, res, next){
        Todo.findAll({ where: { UserId: req.activeUser.id }, order: [['status','DESC'],['due_date','ASC']]})
            .then(async (todos)=>{
                try {
                    for (let i = 0; i < todos.length; i++) {
                        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${todos[i].location}&appid=${apiId}`);
                        const currentWeather = response.data.weather[0].main
                        todos[i].weather = currentWeather;                  
                    }
                    // console.log(todos);
                    res.status(200).json(todos)
                } catch (error) {
                    next(error)
                }
            })
            .catch((err)=>{
                next(err)
                // console.log(err);
                // res.status(500).json({errors: {message: "internal server error"}})
            })
    }

    static getTodoById(req, res, next){
        const findId = +req.params.id
        Todo.findByPk(findId)
            .then((data)=>{
                if (data) {
                    let currentWeather
                    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${data.location}&appid=${apiId}`)
                    .then((response) =>{
                        currentWeather = response.data.weather[0].main
                        data.weather = currentWeather
                        res.status(200).json(data)
                    })
                    .catch(err => {
                        next(err)
                    })
                } else {
                    next({name: "Not Found", message:`Data with id ${findId} not found`})
                    // res.status(404).json({errors: {message: `Data with id ${findId} not found`}})
                }
            })
            .catch((err)=>{
                next(err)
                // console.log(err);
                // res.status(500).json({errors: {message: "internal server error"}})
            })
    }

    
    static putTodoById(req, res, next){
        const updateId = +req.params.id
        let updatedTodo = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date,
            location: req.body.location
        }
        Todo.update(updatedTodo, {
            where: {
              id: updateId
            },
            returning: true
          })
            .then((data)=>{
                if (data[0] === 0) {
                    next({name: "Not Found", message:`Data with id ${updateId} not found`})
                    // res.status(404).json({errors: {message: `Data with id ${updateId} not found`}})
                } else {
                    res.status(200).json(data[1][0])
                }
            })
            .catch((err)=>{
                next(err)
                // if(err.name === `SequelizeValidationError`){
                //     let errs = []
                //     err.errors.forEach(element => {
                //         errs.push({message: element.message})
                //     });
                //     res.status(400).json({errors: errs})
                // }
                // console.log(err);
                // res.status(500).json({errors: {message: "internal server error"}})
            })
    }

    static doneTodoById(req, res, next) {
        const updateId = +req.params.id
        Todo.update({status : req.body.status}, {
            where: {
              id: updateId
            },
            returning: true
          })
          .then((data)=>{
              if (data[0] === 0) {
                next({name: "Not Found", message:`Data with id ${updateId} not found`})
              } else {
                  res.status(200).json(data[1][0])
              }
          })
            .catch((err)=>{
                next(err)
                // if(err.name === `SequelizeValidationError`){
                //     let errs = []
                //     err.errors.forEach(element => {
                //         errs.push({message: element.message})
                //     });
                //     res.status(400).json({errors: errs})
                // }
                // console.log(err);
                // res.status(500).json({errors: {message: "internal server error"}})
            })
    }

    static deleteTodoById(req, res, next){
        const deleteId = +req.params.id
        Todo.destroy({
            where: {
                id: deleteId
            }
        })
            .then((data)=>{
                if (data) {
                    res.status(200).json({success: {message: 'todo success to delete'}})
                } else {
                    next({name: "Not Found", message:`Data with id ${deleteId} not found`})
                    // res.status(404).json({errors: {message: `Data with id ${deleteId} not found`}})
                }
            })
            .catch((err)=>{
                next(err)
                // console.log(err);
                // res.status(500).json({errors: {message: "internal server error"}})
            })
    }


}

module.exports = TodosController