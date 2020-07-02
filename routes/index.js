var express = require('express');
var router = express.Router();
const { getMostRecentTweets, correctPassword } = require('../dbHandler')

router.get('/', async function(req, res, next) {
  if(req.query.valid && req.query.valid.localeCompare('incorrect') === 0) {
    res.render('index', {title: 'Twwwitter', loginError: 'Incorrect login or password.'});
  } else {
    res.render('index', {title: 'Twwwitter'});
  }
});

router.post('/login', async function(req, res, next) {
  try {
    let db = req.app.locals.db;
    const enteredUsername = req.body.username
    const enteredPassword = req.body.password
    if(await correctPassword(db, enteredUsername, enteredPassword)) {
      req.session.loggedIn = enteredUsername
      res.redirect('/users/1')
    } else {
      res.redirect('/?valid=' + 'incorrect');
    }
  } catch (err) {
    throw err;
  }
})

router.get('/requestTweets', async function(req, res, next) {
  try {
    let db =req.app.locals.db;
    let tweets = await getMostRecentTweets(db)
    res.json(tweets)
  } catch (err){
    throw err;
  }
})

module.exports = router;
