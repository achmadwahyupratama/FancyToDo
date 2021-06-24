const {User} = require('../models')
const { decode } = require('../helpers/bcrypt.js')
const { sign } = require('../helpers/jwt.js')
const { OAuth2Client } = require('google-auth-library')


class LogController{
    static register(req, res, next){
        const newUser = {
            email : req.body.email,
            password : req.body.password
        }
        // console.log(newUser);
        User.create(newUser)
            .then((data) => {
                const createdUser = {id: data.id, email:data.email}
                res.status(201).json(createdUser)
            })
            .catch((err)=>{
                // if(err.name === `SequelizeValidationError`){
                //     let errs = []
                //     err.errors.forEach(element => {
                //         errs.push({message: element.message})
                //     });
                //     res.status(400).json({errors: errs})
                // } else 
                if(err.name === "SequelizeUniqueConstraintError"){
                    next({name: err.name, message:"This email has been registered"})
                    // res.status(400).json({errors: {message: "This email has been registered"}})
                } else {
                    next(err)
                    // console.log(err);
                    // res.status(500).json({errors: {message: err.message}})
                }
            })
    }
    
    static login(req, res, next){
        const userInput = {
            email: req.body.email,
            password: req.body.password
        }
        User.findOne({
            where: {
                email: userInput.email
            } 
        })
            .then((data)=>{
                if (!data){
                    // console.log(data);
                    next({name: "invalid email and password"})
                    // res.status(404).json({errors: {message: `invalid email and password`}})
                } else if(decode(userInput.password, data.password)){
                    let access_token = sign({id: data.id, email: data.email})
                    res.status(200).json({id: data.id, email: data.email, access_token})
                } else {
                    next({name: "invalid email and password"})
                    // res.status(400).json({errors: {message: `invalid email and password`}})
                }
            })
            .catch((err) => {
                next(err);
                // console.log(err);
                // res.status(500).json({errors: {message: err.message}})
            })
    }

    static googleLogin(req, res, next){
        console.log(req.body.idToken);
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        let email = ``
        client.verifyIdToken({
            idToken: req.body.idToken,
            audience: process.env.GOOGLE_CLIENT_ID

        })
            .then((ticket)=>{
                const payload = ticket.getPayload()
                email = payload.email
                return User.findOne({where: { email } })
            })
            .then((user) => {
                if (!user) {
                    return User.create({email: email, password: process.env.GOOGLE_PASSWORD})
                } else {
                    const token = sign({id:user.id, email:user.email})
                    res.status(200).json({ access_token: token })
                }
            })
            .then(createdUser => {
                const token = sign({id:createdUser.id, email:createdUser.email})
                res.status(201).json({ access_token: token })
            })
            .catch((err)=>{
                next(err)
            })
    }
}

module.exports = LogController