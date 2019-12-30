const express = require("express")
const bodyparser = require("body-parser")
const app = express()
const mysql = require("mysql")
const jwt = require("jsonwebtoken")
const fileupload = require('express-fileupload')
const AWS = require('aws-sdk')
const secret_key = process.env.SECRET_KEY
app.use(fileupload())
app.use(bodyparser.json())
require("dotenv").config()

// to create database connection
var con = mysql.createConnection({  
    host: process.env.HOST ,  
    user: process.env.user,  
    password : process.env.PASSWORD
})

// to create database  
con.connect((err)=>{
    if (err){console.log(err)}
    else{ 
        con.query(`create database if not exists ${process.env.DB_NAME}`,(err)=>{
            if (!err){console.log("database created")}
            else{console.log(err)}
        })
    }
})
// s3 connection
const s3 = new AWS.S3({
    accessKeyId : process.env.ACCESS_KEY_ID,
    secretAccessKey : process.env.SECRET_ACCESS_KEY,
    apiVersion : '2006-03-01',
    region : 'ap-south-1'
})

// knex connnetion
const knex = require("knex")({
    client : "mysql",
    connection:{
        host : process.env.HOST,
        user : process.env.user,
        password : process.env.PASSWORD,
        database : process.env.DB_NAME
    }
})


// connect all files
require("./routes/database")(knex)

app.use(superadmin = express.Router())
require('./routes/superadmin')(superadmin,knex,jwt)

app.use(login = express.Router())
require('./routes/login')(login,knex,jwt)

app.use(files = express.Router())
require ('./routes/files')(files,knex,jwt,s3)


// server
app.listen(process.env.PORT,()=>{
    console.log(`server is listning on port ${process.env.PORT}`)
})