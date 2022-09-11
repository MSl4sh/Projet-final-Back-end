
//Gestion des erreurs lors de la création d'un nouvel utilisateur.

module.exports.signUpError = (err) => {
    let errors = {pseudo:'', email:'', password:''}

    if(err.message.includes('pseudo')) // si l'utilisateur entre un pseudo non conforme.
        errors.pseudo = 'Pseudo incorrect (min: 3 caractères).'
    if(err.message.includes('email'))// si l'utilisateur entre un email non conforme.
        errors.email = 'Email incorrect.'
    if(err.message.includes('password'))// si l'utilisateur entre un mot de passe non conforme.
        errors.password = 'Mot de passe non conforme (min: 6 caratères).'
    if(err.code===11000 && Object.keys(err.keyValue)[0].includes("pseudo"))// si le pseudo entré est déjà dans la BDD.
        errors.pseudo = 'Ce pseudo est déjà enregistré'
    if(err.code===11000 && Object.keys(err.keyValue)[0].includes("email"))// si l'email entré est déjà dans la BDD.
        errors.email = 'Cet email est déjà enregistré'
    return errors
}

//Gestion des erreurs lors de la connection d'un utilisateur.

module.exports.logInError = (err) => {
    let errors = { email:'', password:''}

    if(err.message.includes('email'))// si l'utilisateur s'est trompé dans son email.
        errors.email = 'Email incorrect.'
    if(err.message.includes('password'))// si l'utilisateur s'est trompé dans son email.
        errors.password = 'Mot de passe incorrect.'

    return errors
}

// Gestion des erreurs dans l'upload des images de profil.

module.exports.uploadError = (err) => {
    let errors = {format:'', maxSize:''};

    if(err.message.includes("Format d'image non supporté"))// si le format n'est pas bon.
        errors.format = "Format d'image incorrect!\n L'image doit être au format JPG, JPEG ou PNG."

    if(err.message.includes("Fichier trop volumineux."))// si le poids n'est pas bon.
        errors.format = "Poids d'image incorrect!\n L'image doit faire max 500ko"

    return errors
}
