var express = require('express');
var router = express.Router();
var csurf = require('csurf')
const csrfProtection = csurf({ cookie: true });
const { getTweets, deleteTweet, addTweet } = require('../dbHandler')

router.get('/', csrfProtection, async function(req, res, next) {
    if(!req.session.loggedIn) res.redirect('../../')
    try {
        let teacher = await isTeacher(db, req.session.loggedIn)
        if(!teacher) res.redirect('../../')
        let db = req.app.locals.db;
        let tweets = await getTweets(db, req.session.loggedIn)
        res.render('entries', {title: 'Your feed', tweets: tweets, csrfToken: req.csrfToken()});
    } catch (err) {

    }
});

router.post('/delete', csrfProtection, async function (req, res, next) {
    if(!req.session.loggedIn) res.redirect('../../')
    try {
        let db = req.app.locals.db;
        const timestamp = req.body.timestamp
        await deleteTweet(db, timestamp, req.session.loggedIn)
        res.redirect('/users/my_entries')
    } catch (err) {
        throw err;
    }
})

router.post('/add', csrfProtection, async function (req, res, next) {
    if(!req.session.loggedIn) res.redirect('../../')
    try {
        let db = req.app.locals.db;
        const content = escape(req.body.tresc)
        await addTweet(db, content, req.session.loggedIn)
        res.redirect('/users/my_entries')
    } catch (err) {
        throw err;
    }
})

function escape(string) {
    return string.replace( /(<([^>]+)>)/ig, '');
}


module.exports = router;