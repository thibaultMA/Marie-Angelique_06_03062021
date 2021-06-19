const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.get('/'      , auth,         sauceCtrl.getAllSauce);
router.post('/'     , auth, multer, sauceCtrl.createSauce);
router.get('/:id'   , auth,         sauceCtrl.getOneSauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.post('/:id/like',auth,sauceCtrl.like)



module.exports = router;