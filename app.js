const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const path = require('path');
const helmet =require('helmet')

require('dotenv').config()
const userRoutes = require('./routes/user')
const saucesRoutes = require('./routes/sauces')

mongoose.connect(process.env.db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  app.use(require('sanitize').middleware)
  app.use(helmet())
  app.use(bodyParser.json());
  
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/auth', userRoutes)
  app.use('/api/sauces', saucesRoutes)


module.exports = app