var express = require('express');
var router = express.Router();
const { getMostRecentTweets, correctPassword } = require('../dbHandler')

// TODO: nie działa wypisywanie ostatnich wpisów
// popraw poniższy kod tak aby wyświetlał ostatnie pięć wpisów w kolejności
// od najnowszego i używał puga
router.get('/', async function(req, res, next) {
  try {
    let db =req.app.locals.db;
    let tweets = await getMostRecentTweets(db)
    if(req.query.valid && req.query.valid.localeCompare('incorrect') === 0) {
      res.render('index', {title: 'Twwwitter', tweets: tweets, loginError: 'Incorrect login or password.'});
    } else {
      res.render('index', {title: 'Twwwitter', tweets: tweets});
    }
  } catch (err){
    throw err;
  }
  /*
  // let db =req.app.locals.db;
  let ostatnieWpisy = '<li>wpis testowy</li>';
  
  db.each('SELECT login_osoby, tresc FROM wpis', function (err, row) {
    ostatnieWpisy += '<li>' + row.login_osoby + ': ' + row.tresc + '</li>';
    console.log(ostatnieWpisy);
  })
  res.send(`
  <p id='error-message'>tutaj powinna się pojawić ewentualna informacja o błędnej próbie logowania</p>
  <form method='post'>
  <input type='text' name='login'>
  <input type='password' name='haslo'>
  <input type='submit'>
  </form>
  <div id='ostatnie-wpisy'>
  <ul>
  ${ostatnieWpisy}
  </ul>
  </div>
  `);  */
});

// TODO: zaimplementuj logowanie
// logowanie powinno albo przekierować do trasy / albo do trasy /users
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

module.exports = router;
