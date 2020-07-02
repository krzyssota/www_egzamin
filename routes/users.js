var express = require('express');
var router = express.Router();
const { getSubscribedTweets } = require('../dbHandler')

router.get('/:page(\\d+)', async function(req, res, next) {
  let pageNo =  parseInt(req.params.page)
  if(pageNo < 1) pageNo = 1
  if(!req.session.loggedIn) res.redirect('../')
  try {
    let db = req.app.locals.db;
    let tweets = await getSubscribedTweets(db, req.session.loggedIn, (pageNo-1)*3)
    res.render('users', {title: 'Your feed', tweets: tweets, prevPage: (pageNo > 1 ? pageNo-1 : pageNo), nextPage: pageNo+1});
  } catch (err) {
    throw err;
  }
});

router.get('/logout', async function(req, res, next) {
  req.session.loggedIn = undefined;
  res.redirect('../')
});

router.get('/my_entries', function(req, res, next) {
  res.send(`<a href=/users/my_entires/>My entries</a>
  <ul>
  <li>entry one <a href=#>delete</a></li>
  <li>entry two <a href=#>delete</a></li>
  <li>entry three <a href=#>delete</a></li>
  </ul>
  <a href='#'>prev page(if applicable)</a>
  <a href='#'>next page(if applicable)</a>
  <form>
  <textarea>
  </textarea>
  <input type="submit" value="Add">
  </form>
  `);
});


module.exports = router;
