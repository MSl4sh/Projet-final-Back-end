require('dotenv').config({path:'./config/.env.development'});
const {PORT,CLIENT_URL} = process.env;
require('./config/bdd');
const {checkUser, requireAuth} = require('./middleware/auth.middleware')
const express = require('express');
const bodyParser= require ('body-parser');
const cookieParser = require ('cookie-parser')
const userRoutes = require('./routes/user.routes.js');
const publicationRoutes = require('./routes/publication.routes.js');
const cors = require('cors')
const app = express();

const corsOption ={
    origin: CLIENT_URL,
    credentials:true,
    "allowedHeaders" : ['sessionId', 'Content-Type'],
    "exposedHeaders" : ['sessionId'],
    'methods':'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false

}
app.use(cors({corsOption}));


app.use(express.static("public"))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


//Verification de l'utilisateur sur toutes les routes.
app.get('*', checkUser)

// Test du token d'un nouvel utilisateur.
app.get('/jsonWebTokenId', requireAuth, (req,res) => {
    res.status(200).send(res.locals.user._id)
})

//routes des utilsateurs.

app.use('/api/user', userRoutes);

//routes des publications.
app.use('/api/publication', publicationRoutes)

//server express.

app.listen(PORT, () =>{
    console.log(`En écoute du port ${PORT}.`);
});