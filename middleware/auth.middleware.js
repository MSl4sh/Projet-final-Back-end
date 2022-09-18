const jsonWebToken = require ('jsonwebtoken');
const UserModel = require("../models/user.model");



// Vérifification du token de l'utilisateur à la connexion.
module.exports.checkUser = (req, res, next) => {

    const token = req.cookies.jsonWebToken
    if(token){
        jsonWebToken.verify(token, process.env.TOKEN, async (err, docs) => {
            if(err){
                res.locals.user = null;
                // res.cookie('jsonWebToken', {maxAge: 1})// si erreur, la durée de vie du token est réduite pour empécher la connexion.
                next()
            }
            else {
                let user = await UserModel.findById(docs.id)
                res.locals.user = user;
                console.log(res.locals.user);
                next()
            }
        })
    }
    else {
        res.locals.user = null
        next()
    }
}


module.exports.requireAuth = (req, res, next) => {

    const token = req.cookies.jsonWebToken
    if(token){
        console.log("token vérifié")
        jsonWebToken.verify(token, process.env.TOKEN, async (err, docs) => {
            if(err){
                console.log(err)
            }
            else {
                console.log(docs.id)
                next()
            }
        })
    }
    else {
        console.log('pas de token de connection')
    }
}
