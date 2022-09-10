const router = require('express').Router();
const publicationController = require('../controllers/publication.controller')

router.get('/', publicationController.readPublication); //Lire toutes les publications.
router.post('/', publicationController.createPublication);//Créer une nouvelle publication.
router.put('/:id', publicationController.updatePublication);//Modifier une publication par son Id.
router.delete('/:id', publicationController.deletePublication);//Supprimer une publication par son Id


module.exports= router

