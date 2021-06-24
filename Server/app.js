if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const cors = require('cors')
const express = require('express')
const errorHandler = require('./middlewares/errorHandler')
const router = require('./routers')
const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use( router )
app.use( errorHandler )
app.listen(port, () => {
    console.log(`todos app listening at http://localhost:${port}`)
  })