module.exports = (knex)=>{
    knex.schema.hasTable('users').then((exist)=>{
        if (exist){
            console.log("table already exists")
        }else{
            knex.schema.createTable("users",(u)=>{
                u.increments("id").primary();
                u.UNIQ("email");
                u.string("password").notNullable();
                u.string("role").notNullable();
            })
            .then(()=>{console.log("table created")})
            .catch((err)=>{
                console.log(err)
            })
        }
    })

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