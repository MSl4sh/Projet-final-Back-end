const UserModel = require ('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;


const userController = {
    //récuperer tout les utilisateur dans la base de données.
    getAll: async (req, res) =>{
        const users = await UserModel.find().select('-password');
        res.status(200).json(users) 
    },
    //récuperer un utilisateur par son ID.
    getById: async (req, res) =>{
        console.log(req.params)
        //Verification de l'id dans la BDD.
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send('Id inconnu au bataillon: ' + req.params.id) // si l'id n'est pas connu, erreur 400.
        UserModel.findById(req.params.id, (err, docs)=>{
            if(!err) res.send(docs)
            else console.log('Id inconnu au bataillon: '+ err)
        }).select('-password')
    },
    //modifier un utilisateur par son ID.
    update: async (req, res) =>{
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send('Id inconnu au bataillon: ' + req.params.id)
        try {
            await UserModel.findByIdAndUpdate(
                {_id: req.params.id},
                {
                    $set : {
                        bio: req.body.bio
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true},
                (err, docs) => {
                    if(!err) return res.send(docs);
                    if(err) return res.status(500).send({message: err})
                }
            ).clone() // .clone => permet d'executer le même Query object 2 fois (doc mongoose dernière version) 
        }catch (err) {
            console.log(err)
            return res.status(500).json({message: err})
        }
    },
    // supprimer un utilisateur grâce à son ID.
    delete : async (req,res) => {
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send('Id inconnu au bataillon: ' + req.params.id)
        try{
            await UserModel.remove({_id: req.params.id}).exec();
            res.status(200).json({message: "utilisateur supprimé"})
        } catch(err){
            console.log(err)
            return res.status(500).json({message: err})
        }
    },
    // ajouter un follow à un utilisateur.
    follow : async (req,res) => {
        if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
            return res.status(400).send('Id inconnu au bataillon: ' + req.params.id)
        try{
            //ajout de l'id de l'utilisateur suivi dans la liste des follows
            await UserModel.findByIdAndUpdate(
                req.params.id,
                {$addToSet: {follows: req.body.idToFollow}},
                {new :true, upsert:true },
                (err, docs) => {
                    if(!err) res.status(201).json(docs);
                    else return res.status(400).json(err);
                }
            ).clone();
            //ajout de l'id du follower dans la liste des follower de l'utilisateur suivi.
            await UserModel.findByIdAndUpdate(
                req.body.idToFollow,
                {$addToSet: {followers : req.params.id}},
                {new :true, upsert:true },
                (err, docs) => {
                    if(err) return res.status(400).json(err);
                }
            ).clone();
            
        } catch(err){
            console.log(err)
            return res.status(500).json({message: err})
        }
    },
    // supprimer un follow à un utilisateur.
    unfollow : async (req,res) => {
        if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
            return res.status(400).send('Id inconnu au bataillon: ' + req.params.id)
            try{
                //retirer de l'id de l'utilisateur suivi dans la liste des follows
                await UserModel.findByIdAndUpdate(
                    req.params.id,
                    {$pull: {follows: req.body.idToUnfollow}},
                    {new :true, upsert:true },
                    (err, docs) => {
                        if(!err) res.status(201).json(docs);
                        else return res.status(400).json(err);
                    }
                ).clone();
                //retirer l'id du follower dans la liste des follower de l'utilisateur suivi.
                await UserModel.findByIdAndUpdate(
                    req.body.idToUnfollow,
                    {$pull: {followers : req.params.id}},
                    {new :true, upsert:true },
                    (err, docs) => {
                        if(err) return res.status(400).json(err);
                    }
                ).clone();
                
            } catch(err){
                console.log(err)
                return res.status(500).json({message: err})
            }
    }
}

module.exports = userController;
