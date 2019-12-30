module.exports = (login,knex,jwt)=>{
    // to login in this app
    login.post("/login",(req,res)=>{
        knex('users')
        .select('*')
        .where('email',req.body.email)
        .then((data)=>{
            if (data.length>0){
                if (data[0].password==req.body.password){
                    jwt.sign({id:data[0].id},process.env.SECRET_KEY,(err,token)=>{
                        if (err){res.send(err)}
                    res.cookie("token",token)
                    res.send("you are logged in ")
                })
                }else{
                    res.send("wrong password")
                }
            }else{
                res.send("you are not participants of this app")
            }
        }).catch((err)=>{
            res.send(err)
        })
    })

    login.post("/logout",(req, res)=>{
        res.clearCookie("token")
        res.send("loged out")
    })
}

