const mongoose = require('mongoose')
const {BDD} = process.env

mongoose
    .connect("mongodb+srv://"+process.env.BDD+"@cluster0.espuubt.mongodb.net/projetfinal",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        })
    .then(() => console.log('Connecté à la base de données.'))
    .catch((err) => console.log('Erreur de connection à la base de données', err))

