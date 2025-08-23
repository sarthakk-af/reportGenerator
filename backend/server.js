const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const todoRouter = require('./routes/rgRoutes')

require('dotenv').config()

 const app = express()
 app.use(bodyParser.json())
 app.use(cors())


 mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected...!!")
 }).catch((error)=>{
    console.log('error',error)
 })

 app.use('/api',todoRouter)

 app.listen(process.env.PORT,()=>(
    console.log(`Server Started at ${process.env.PORT}`)
 ))