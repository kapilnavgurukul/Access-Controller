module.exports = (superadmin, knex, jwt) => {
    // for ragister in this app
    superadmin.post("/ragister", (req, res) => {
        knex('users')
            .select('*')
            .then((data) => {
                if (data.length == 0) {
                    knex('users')
                        .insert({
                            "email": req.body.email,
                            'password': req.body.password,
                            'role': "SuperAdmin"
                        }).then(() => {
                            res.send("you are ragistered successful and now you are superadmin")
                        }).catch((err) => { res.send(err) })
                } else {
                    let token = req.headers.cookie;
                    if (token == undefined) { res.send("please login") }
                    else {
                        let tokenS = token.slice(6, token.length)
                        jwt.verify(tokenS, process.env.SECRET_KEY, (err, TokenData) => {
                            if (err) {
                                console.log(err)
                                res.send("login problem")
                            } else {
                                if (TokenData.id == 1) {
                                    knex('users')
                                        .insert({
                                            "email": req.body.email,
                                            'password': req.body.password,
                                            'role': 'viewer'
                                        })
                                        .then(() => { res.send('user successfuly add') })
                                        .catch((err) => { res.send(err) })
                                } else {
                                    res.send("only superadmin can add peopel")
                                }
                            }
                        })
                    }
                }
            })
            .catch((err) => { res.send(err) })
    })

    // for give access to user 
    superadmin.post("/ChangeAccess/:role", (req, res) => {
        let token = req.headers.cookie;
        if (token == undefined) { res.send("please login") }
        else {
            let tokenS = token.slice(6, token.length)
            jwt.verify(tokenS, process.env.SECRET_KEY, (err, TokenData) => {
                if (err) {
                    res.send("again login")
                } else {
                    if (TokenData.id == 1) {
                        if (req.body.id == 1) {
                            res.send("you are superadmin")
                        } else if (req.params.role == "viewer") {
                            knex("users")
                                .update({ 'role': "viewer" })
                                .where('id', req.body.id)
                                .then(() => {
                                    res.send(`${req.body.id} can only seen and he is viewer`)
                                }).catch((err) => {
                                    res.send(err)
                                })
                        } else if (req.params.role == "editer") {
                            knex("users")
                                .update({ role: "editer" })
                                .where('id', req.body.id)
                                .then(() => {
                                    res.send(`${req.body.id} can edit and he is editer`)
                                }).catch((err) => {
                                    res.send(err)
                                })
                        } else {
                            res.send("put only viewer or editor")
                        }
                    } else {
                        res.send("only superadmin can asign role")
                    }
                }
            })
        }
    })



    superadmin.delete("/deleteuser/:id", (req, res) => {
        let token = req.headers.cookie
        if (token == undefined) { res.send("please login") }
        else {
            let tokenS = token.slice(6, token.length)
            jwt.verify(tokenS, process.env.SECRET_KEY, (err, TokenData) => {
                if (err) { res.send(err) }
                else {
                    if (TokenData.id == 1) {
                        knex("users")
                            .where('id', req.params.id)
                            .del()
                            .then(() => {
                                res.send({ "msg": "successful delete" })
                            })
                            .catch((err) => {
                                res.send(err)
                            })
                    }
                    else { res.send({ "msg": "only superadmin can delete" }) }
                }
            })
        }
    })
}

