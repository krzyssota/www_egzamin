

function getMostRecentTweets(db) {
    let posts = [];
    return new Promise((resolve, reject) => {
        let sqlQuery = 'SELECT tresc FROM wpis ORDER BY timestamp DESC LIMIT 5;'
        db.all(sqlQuery, (err, rows) => {
                if(err) {
                    reject(new Error('Internal error while extracting last 5 tweets.'))
                    return;
                }
                for(let row of rows) {
                    posts.push(row.tresc)
                }
                resolve(posts)
            })
    })
}

function correctPassword(db, enteredUsername, enteredPassword) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'SELECT haslo FROM osoba WHERE login=?;'
        db.get(sqlQuery, [enteredUsername], (err, row) => {
            if(err) {
                reject(new Error('Internal error while verifying password.'))
                return;
            }
            if(row) {
                if(enteredPassword.localeCompare(row.haslo) === 0) {
                    resolve(true)
                }
            }
            resolve(false)
        })
    })
}

function getSubscribedTweets(db, username, offset) {
    let posts = [];
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sqlQuery = `SELECT tresc FROM wpis as w JOIN sledzacy as s ON w.login_osoby=s.login_sledzonego WHERE s.login_osoby=? LIMIT 3 OFFSET ?;`
            db.all(sqlQuery, [username, offset], (err, rows) => {
                if(err) {
                    reject(new Error('Internal error while extracting subscription.'))
                    return;
                }
                for(let row of rows) {
                    posts.push(row.tresc)
                }
                resolve(posts)
            })
        })
    })
}

function isTeacher(db, username) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'SELECT nauczyciel FROM osoba WHERE login=?;'
        db.get(sqlQuery, [username], (err, row) => {
            if(err) {
                reject(new Error('Internal error while checking if teacher.'))
                return;
            }
            if(row) {
                if('1'.localeCompare(row.nauczyciel) === 0) {
                    resolve(true)
                }
            }
            resolve(false)
        })
    })
}

function getTweets(db, username) {
    let posts = [];
    return new Promise((resolve, reject) => {
        let sqlQuery = 'SELECT tresc, timestamp FROM wpis WHERE login_osoby=?;'
        db.all(sqlQuery, [username], (err, rows) => {
            if(err) {
                reject(new Error('Internal error while extracting tweets.'))
                return;
            }
            for(let row of rows) {
                posts.push([row.tresc, row.timestamp])
            }
            resolve(posts)
        })
    })
}

function deleteTweet(db, timestamp, username) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'DELETE FROM wpis WHERE login_osoby=? AND timestamp=?;'
        db.run(sqlQuery, [username, timestamp], (err) => {
            if(err) {
                reject(new Error('Internal error while deleting tweets.'))
                return;
            }
            resolve()
        })
    })
}

function addTweet(db, timestamp, username) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO wpis VALUES (?,CURRENT_TIMESTAMP, ?);`,
            [username, timestamp],
            (err) => {
                if(err) {
                    reject(new Error('Internal error inserting tweet.'))
                    return;
                }
                resolve()
            })
    })
}

exports.getMostRecentTweets = getMostRecentTweets;
exports.correctPassword = correctPassword
exports.getSubscribedTweets = getSubscribedTweets
exports.isTeacher = isTeacher
exports.getTweets = getTweets
exports.deleteTweet = deleteTweet
exports.addTweet = addTweet

