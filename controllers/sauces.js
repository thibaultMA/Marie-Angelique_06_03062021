const Sauces = require('../models/sauces');
const fs = require('fs');



exports.getAllSauce = (req, res, next) => {
    Sauces.find()
      .then((sauce) => { res.status(200).json(sauce); })
      .catch((error) => { res.status(400).json({ error: error }) });
};

exports.createSauce = (req, res, next) => {

    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauces({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce crée !' }))
      .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({
      _id: req.params.id
    }).then((sauce) => { res.status(200).json(sauce); }
    ).catch((error) => { res.status(404).json({ error: error }) });
};
exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
  .then(sauce =>{
    const extention = ".jpg"&&".png"&&".jpeg"
    const filename = sauce.imageUrl.split('/images/')[1]

      if (req.file) {
        fs.unlink(`images/${filename}`,(err) => {
          if (err) throw err;
          console.log('Fichier supprimé !');
        })
      }
        const sauceObject = req.file ?
        {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
        Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
      
    
  })
  .catch(error => res.status(500).json({ error }));
  
};

exports.like = (req,res,next) => {
  
  Sauces.findOne({_id:req.params.id})
  .then((sauce) =>{

    let userId = req.body.userId
    let like = req.body.like
    let indexLike = sauce.usersLiked.indexOf(userId)
    let indexDislike = sauce.usersDisliked.indexOf(userId)
    if (like === 1 ) {

       if (indexLike === -1) {
        Sauces.updateOne({ _id: req.params.id },{
          $inc:{likes:like},
          $push:{usersLiked: userId},
          _id: req.params.id
        })
        .then(() => { res.status(201).json({ message: 'like enregistré' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      }
      if (indexDislike != -1){
        Sauces.updateOne({ _id: req.params.id },{
          $inc:{dislikes:-like},
          $pull:{usersDisliked: userId},
          _id: req.params.id
        })
        .then(() => { res.status(201).json({ message: 'dislike enlever' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      }
    } 
    if(like === -1) {


      if (indexLike != -1) {

       Sauces.updateOne({ _id: req.params.id },{
         $inc:{likes:-1},
         $pull:{usersLiked: userId},
         _id: req.params.id
       })
       .then(() => { res.status(201).json({ message: 'like enregistré' }); })
       .catch((error) => { res.status(400).json({ error: error }); });
     }
     if (indexDislike === -1){
       Sauces.updateOne({ _id: req.params.id },{
         $inc:{dislikes:+1},
         $push:{usersDisliked: userId},
         _id: req.params.id
       })
       .then(() => { res.status(201).json({ message: 'dislike ajouter' }); })
       .catch((error) => { res.status(400).json({ error: error }); });
     }
    }
    if(like === 0) {

       if (indexLike != -1) {
        
        Sauces.updateOne({ _id: req.params.id },{
          $inc:{likes:-1},
          $pull:{usersLiked: userId},
          _id: req.params.id
        })
        .then(() => { res.status(201).json({ message: 'like retirer' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      }
      if (indexDislike != -1){
        Sauces.updateOne({ _id: req.params.id },{
          $inc:{dislikes:-1},
          $pull:{usersDisliked: userId},
          _id: req.params.id
        })
        .then(() => { res.status(201).json({ message: 'dislike retirer' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      }
    }
  })
  .catch((error) => { res.status(404).json({ error: error })})
};