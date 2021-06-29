const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken') 
const User = require('../models/user'); 
const mask = require('maskdata')
const emailMask = {
  maskWith: "*", 
  maxMaskedCharacters: 5,
    unmaskedStartCharactersBeforeAt: 4,
    unmaskedEndCharactersAfterAt: 3,
    maskAtTheRate: false
}


exports.signup = (req, res, next) => {
  
bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const email = req.body.email
      const maskedEmail = mask.maskEmail2(email , emailMask)
      console.log(maskedEmail);
      const user = new User({
        email: maskedEmail,
        password: hash,
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}
exports.login = (req, res, next) => {
  const email = req.body.email
  const maskedEmail = mask.maskEmail2(email , emailMask)
  console.log(maskedEmail);
    User.findOne({ email: maskedEmail})
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };