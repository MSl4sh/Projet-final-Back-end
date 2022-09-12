const publicationModel = require('../models/publication.model');
const PublicationModel = require('../models/publication.model');
const UserModel = require('../models/user.model');
const ObjectID= require('mongoose').Types.ObjectId;
const fs = require('fs')// dépendence native de gestion de fichier "file system".
const { promisify } = require('util');
const { uploadError } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);


//Publications.

module.exports.readPublication = (req, res)=> {

    PublicationModel.find((err, docs)=>{
        if(!err) res.send(docs); //si pas d'erreurs, on envoie le docs.
        else console.log("Erreur dans l'obtention des données: " + err) //si erreur, affichage dans la console de l'erreur rencontrée.
    }).sort({createdAt: -1}); //Trie les publications  de manière à ce qu'elles apparaissent de la plus récente à la plus ancienne.

}

module.exports.createPublication = async (req, res)=> {

    let fileName;

    if(req.file !== null ){
        try {
            if (req.file.detectedMimetype !== "image/jpg" && req.file.detectedMimetype !== "image/jpeg" && req.file.detectedMimetype !== "image/png")// vérification que l'image proposée soit bien au format "jpg","jpeg" ou "png".
                throw Error("Format d'image non supporté")
            if (req.file.size >500000) throw Error("Fichier trop volumineux.")// vérification du poids de l'image.
        }catch(err){
            const error = uploadError(err)// Appel de la fonction uploadError (utils)
            return res.status(201).json({error})
        }
    
        fileName = req.body.posterId + Date.now() + '.jpg'

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${_dirname}/../client/public/uploads/publication/${imgName}`//Url du dossier de stockage des images de publication.
            )
        );

    }

    const newPublication = new PublicationModel({ 
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !==null ?`http://localhost:${PORT}/public/uploads/publication/${fileName}` :"",
        video: req.body.video,
        likers: [],
        comments:[],
    })

    try{
        const publication = await newPublication.save()
        return res.status(201).json(publication)
    }catch (err) {
        return res.status(400).send(err)
    }


    
}

module.exports.updatePublication = (req, res)=> {
    if (!ObjectID.isValid(req.params.id))
            return res.status(400).send('Id inconnu au bataillon: ' + req.params.id) // vérification de l'id.
    const updatedContent ={
        message : req.body.message 
    }
    PublicationModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedContent},
        { new: true },
        (err, docs) => {
            if(!err) res.send(docs);
            else console.log("Erreur dans la modification de la publication: "+ err)
        }
    )
    
}

module.exports.deletePublication = (req, res)=> {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu au bataillon: ' + req.params.id) // vérification de l'id.

    PublicationModel.findByIdAndDelete(
        req.params.id,
        (err, docs) => {
            if(!err) res.send(docs);
            else console.log("Erreur dans la suppression de la publication: "+ err)
        }
        
        )

    
}
module.exports.likePublication = async (req, res)=> {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu au bataillon: ' + req.params.id) // vérification de l'id.

    try{
        await publicationModel.findByIdAndUpdate(
            req.params.id,//récupération de l'id de la publication 
            {$addToSet : {likers : req.body.id}},//Ajout de l'id du Liker dans le tableau "likers" de la publication.
            {new:true},
            (err, docs) => {
                if(err) return res.status(400).send(err)
            }
        )
        await UserModel.findByIdAndUpdate(
            req.body.id,//récupération de l'id du Liker.
            {$addToSet : {like : req.params.id}},//ajout de L'id de la publication dans le tableau "Like" du liker.
            (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err)
                
            }
        )
    } catch(err){
        return res.status(400).send(err)
    }

    
}
module.exports.unlikePublication = async (req, res)=> {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu au bataillon: ' + req.params.id) // vérification de l'id.
        try{
            await publicationModel.findByIdAndUpdate(
                req.params.id,//récupération de l'id de la publication 
                {$pull : {likers : req.body.id}},//suppression de l'id du Liker dans le tableau "likers" de la publication.
                {new:true},
                (err, docs) => {
                    if(err) return res.status(400).send(err)
                }
            )
            await UserModel.findByIdAndUpdate(
                req.body.id,//récupération de l'id du Liker.
                {$pull : {like : req.params.id}},//suppression de L'id de la publication dans le tableau "Like" du liker.
                (err, docs) => {
                    if(!err) res.send(docs);
                    else return res.status(400).send(err)
                    
                }
            )
        } catch(err){
            return res.status(400).send(err)
        }
    

    
}

//commentaires


module.exports.commentPublication = (req, res)=> {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu au bataillon: ' + req.params.id) // vérification de l'id.

    try{
        return PublicationModel.findByIdAndUpdate(
            req.params.id,
            {$push : {  //push des informations en dessous dans le tableau "comment" des publications.
                comments: {
                    commenterId : req.body.commenterId,
                    commenterPseudo: req.body.commenterPseudo,
                    commentText: req.body.commentText,
                    timestamp: new Date().getTime()
                }
            }
            },
            {new: true},
            (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err)
                
            }


        )
    } catch(err){
        return res.status(400).send(err)
    }
}


module.exports.editCommentPublication = (req, res)=> {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu au bataillon: ' + req.params.id) // vérification de l'id.

    try{
        return PublicationModel.findById(
            req.params.id,
            (err, docs) => {
                const thisComment = docs.comments.find((comment) => 
                    comment._id.equals(req.body.commentId) // fait correspondre la constante "this comment" avec l'id du commentaire visé.
                )
                
                if(!thisComment) return res.status(404).send('Commentaire non trouvé')//Vérification de l'existence du commentaire dans la BDD.
                thisComment.text = req.body.text;

                return docs.save((err) =>{
                    if(!err) return res.status(200).send(docs);
                    return res.status(500).send(err);
                })
            }
        )

    }catch(err) {
        return res.status(400).send(err)
    }

}


module.exports.deleteCommentPublication = async (req, res)=> {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu au bataillon: ' + req.params.id) // vérification de l'id.

    try{
        return PublicationModel.findByIdAndUpdate(
            req.params.id,// Id de la publication qui contient le commentaire à supprimer.
            {$pull:{// modification du tableau "comments" de la publication.
                comments:{
                    _id: req.body.commenterId,
                }
            }},
            {new : true},
            (err,docs)=>{
                if(!err) return res.status(200).send(docs);
                    return res.status(400).send(err);
            }
        )
    }catch(err){
        return res.status(400).send(err);
    };


};