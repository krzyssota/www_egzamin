var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send(`<a href=/users/my_entires/>My entries</a>
  <ul>
  <li>entry one</li>
  <li>entry two</li>
  <li>entry three</li>
  </ul>
  <a href='#'>prev page(if applicable)</a>
  <a href='#'>next page(if applicable)</a>
  `);
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
