const UserModel = require("../models/user.model");
const jsonWebToken = require ('jsonwebtoken');
const { signUpError, logInError } = require("../utils/errors.utils");
const { default: isEmail } = require("validator/lib/isEmail");
const maxAge = 3*24*60*60*1000
const createToken = (id) =>{
    return jsonWebToken.sign({id}, process.env.TOKEN,{
        expiresIn: maxAge
    })
};


const authController = {
    signUp : async (req, res) => {
        const {pseudo, email, password}=req.body
        
        
        console.log('coucou')

        try {
            const user = await UserModel.create({pseudo, email, password});
            const token = createToken(user._id)
            res.cookie('jsonWebToken', token,{HttpOnly: true, maxAge: maxAge})
            res.status(201).json({ user: user._id, token}) // renvoie l'id de l'utilisateur si la requête est passée.
        }
        catch(err){
            const errors= signUpError(err)
            
            
            res.status(200).json({errors})
            
        }
    },
    logIn : async (req, res) => {
        const {email, password}=req.body

        try {
            const user = await UserModel.login(email, password);
            console.log(user)
            const token = createToken(user._id)
            res.cookie('jsonWebToken', token,{HttpOnly: true, maxAge: maxAge})
            res.status(200).json({user : user._id, token})
        }
        catch(err){
            const errors = logInError(err)
            console.log(errors)
            res.status(200).json({errors})
            
        }
    },
    logOut: async (req, res) => {
        res.cookie('jsonWebToken', '',{maxAge: 1}),
        res.redirect('/')
    }
}


module.exports = authController