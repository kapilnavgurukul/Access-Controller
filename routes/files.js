module.exports = (files, knex, jwt, s3) => {
    files.post("/upload", (req, res) => {
        let token = req.headers.cookie
        if (token == undefined) { res.send("please login") }
        else {
            let tokenS = token.slice(6, token.length)
            jwt.verify(tokenS, process.env.SECRET_KEY, (err, TokenData) => {
                if (err) { res.send(err) }
                else {
                    if (TokenData.id == 1) {
                        const file = req.files.file;
                        params = {
                            Key: "Kapil/" + file.name,  
                            Body: file.data,
                            Bucket: process.env.BUCKET,
                            ACL: 'public-read'
                        }
                        // chacking if file already exists in or not
                        knex("files")
                            .select('*')
                            .where('file_name', file.name)
                            .then((data) => {
                                if (data.length == 0) {
                                    s3.upload(params, (err, data) => {
                                        if (err) {
                                            res.send(err)
                                        } else {
                                            knex('files')
                                                .insert({
                                                    'url': "https://acpkaplu.s3.ap-south-1.amazonaws.com/Kapil/" + `${file.name}`,
                                                    'file_name': file.name,
                                                    'user_id': TokenData.id
                                                })
                                                .then((data) => {
                                                    res.send("file successful add")
                                                })
                                                .catch((err) => {
                                                    res.send(err)
                                                })
                                        }
                                    })
                                }
                                else { res.send("change filename") }
                            })
                    } else {
                        res.send("only superadmin can add resource")
                    }
                }
            })
        }
    })

    files.put("/editfile/:id", (req, res) => {
        let token = req.headers.cookie;
        if (token == undefined) { res.send("please login") }
        else {
            let tokenS = token.slice(6, token.length)
            jwt.verify(tokenS, process.env.SECRET_KEY, (err, TokenData) => {
                if (err) {
                    console.log('error');
                    res.send({ "msg:": "login again" })
                } else {
                    knex('users')
                        .select('role')
                        .where('id', TokenData.id)
                        .then((data) => {
                            if (data[0].role != 'viewer') {
                                const file = req.files.file;
                                params = {
                                    Key: "Kapil/" + file.name,
                                    Body: file.data,
                                    Bucket: process.env.BUCKET,
                                    ACL: 'public-read'
                                }
                                s3.upload(params, (err) => {
                                    if (err) {
                                        res.send(err)
                                    }
                                    else {
                                        knex('files')
                                            .update({
                                                'url': "https://acpkaplu.s3.ap-south-1.amazonaws.com/Kapil/" + `${file.name}`,
                                                'file_name': file.name,
                                                'user_id': TokenData.id
                                            })
                                            .where('id', req.params.id)
                                            .then((data) => {
                                                res.send("file successful edit")
                                            })
                                            .catch((err) => {
                                                res.send(err)
                                            })
                                    }
                                })

                            } else {
                                res.send({ "msg": "only Superadmin and Editer can edit files" })
                            }
                        })
                        .catch((err) => {
                            res.send(err)
                        })

                }
            })
        }
    })

    files.get("/files", (req, res) => {
        let token = req.headers.cookie;
        if (token == undefined) { res.send("please login") }
        else {
            let tokenS = token.slice(6, token.length)
            jwt.verify(tokenS, process.env.SECRET_KEY, (err, TokenData) => {
                if (err) { res.send(err) }
                else {
                    knex("files")
                        .select("*")
                        .then((data) => {
                            res.send(data)
                        })
                        .catch((err) => {
                            res.send(err)
                        })
                }
            })
        }
    })

    files.delete("/deletefile/:id", (req, res) => {
        let token = req.headers.cookie;
        if (token == undefined) { res.send("please login") }
        else {
            let tokenS = token.slice(6, token.length)
            jwt.verify(tokenS, process.env.SECRET_KEY, (err, TokenData) => {
                if (TokenData.id == 1) {
                    knex('files')
                        .select('file_name')
                        .where('id', req.params.id)
                        .then((data) => {
                            if (data.length == 0) { res.send("file not exitst") }
                            else {
                                params = {
                                    Key: "Kapil/" + data[0].file_name,
                                    Bucket: process.env.BUCKET,
                                }
                                s3.deleteObject(params, (err) => {
                                    if (err) {
                                        res.send(err)
                                    }
                                    else {
                                        knex('files')
                                            .where('id', req.params.id)
                                            .del()
                                            .then(() => {
                                                res.send("file deleted")
                                            })
                                            .catch((err) => { res.send(err) })
                                    }
                                })
                            }
                        })
                        .catch((err) => { res.send(err) })
                }
                else (res.send({ 'msg': "only superadmin can delete file" }))
            })
        }
    })
}