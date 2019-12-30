module.exports = (knex)=>{
    const mysql = require("mysql")
    // to create user table
    knex.schema.hasTable('users').then((exist)=>{
        if (exist){
            console.log("table already exists")
        }else{
            knex.schema.createTable("users",(u)=>{
                u.increments("id").primary();
                u.string("email").unique();
                u.string("password").notNullable();
                u.string("role").notNullable();
            })
            .then(()=>{console.log("table created")})
            .catch((err)=>{
                console.log(err)
            })
        }
    })

    // to create files ta
    knex.schema.hasTable('files').then((exist)=>{
        if (exist){
            console.log("table already exists")
        }else{
            knex.schema.createTable("files",(u)=>{
                u.increments("id").primary();
                u.string("user_id").notNullable();
                u.string("file_name").notNullable();
                u.string("url").notNullable()
            })
            .then(()=>{console.log("table created")})
            .catch((err)=>{
                console.log(err)
            })
        }
    })    
}