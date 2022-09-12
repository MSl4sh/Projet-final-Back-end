const { Schema, model} = require('mongoose');
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')


const userSchema = new Schema({
    pseudo : {
        type : String,
        required : true,
        minlength: 3,
        maxlength: 15,
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase: true,
        validate:[isEmail],
        trim : true
    },
    password : {
        type : String,
        required : true,
        max: 1024,
        minlength: 6
    },
    img:{
        type: String,
        default: "./uploads/profil/random-user.png"
    },
    bio:{
        type: String,
        maxlength: 250,
    },
    followers:{
        type: [String]
    },
    follows: {
        type: [String]
    },
    like:{
        type: [String]
    }
},
{
    timestamps: true,
}
)
//cryptage du password avant d'enregistrer l'utilisateur dans la BDD bcrypt.
userSchema.pre("save", async function(next) {
    const crypt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, crypt)
    next();
});

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email})
    if (user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user;
        }
        throw Error('mot de passe incorrecte')
    }
    throw Error('Email incorrecte')

}

const User = model('User', userSchema);

//export du module
module.exports = User;