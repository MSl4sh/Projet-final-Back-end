const UserModel = require('../models/user.model');
const fs = require('fs')// dépendence native de gestion de fichier "file system".
const { promisify } = require('util');
const { uploadError } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);

module.exports.uploadProfil = async (req, res) => {
    try {
        if (req.file.detectedMimetype !== "image/jpg" && req.file.detectedMimetype !== "image/jpeg" && req.file.detectedMimetype !== "image/png")// vérification que l'image proposée soit bien au format "jpg","jpeg" ou "png".
            throw Error("Format d'image non supporté")
        if (req.file.size >500000) throw Error("Fichier trop volumineux.")// vérification du poids de l'image.
    }catch(err){
        const error = uploadError(err)// Appel de la fonction uploadError (utils)
        return res.status(201).json({error})
    }

    const imgName= req.body.name+ ".jpg"; 

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${_dirname}/../client/public/uploads/profil/${imgName}`//Url du dossier de stockage des images(react)
        )
    );
    try{
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            {$set: {img:"./uploads/profil/"+ imgName}},// envoi de l'url de l'image dans le champs "img" de l'utilisateur.
            {new: true, upsert: true, setDefaultsOnInsert:true},
            (err,docs)=>{
                if(!err) return res.send(docs);
                else return res.status(500).send({message:err})
            }
        
        )
    }catch(err){
        return res.status(500).send({message:err})
    }
}