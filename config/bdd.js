const mongoose = require('mongoose')

mongoose
    .connect("mongodb+srv://MrSlash:Lyoko001++@cluster0.espuubt.mongodb.net/projetfinal",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        })
    .then(() => console.log('Connecté à la base de données.'))
    .catch((err) => console.log('Erreur de connection à la base de données', err))

