

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

function addPost(post) {
    return new Promise((resolve, reject) => {
        const db = openDB();
        db.run(`INSERT INTO postsTable VALUES (?);`,
            [post['msg']],
            (err) => {
                if(err) {
                    reject(new Error('Internal error inserting msg.'))
                    return;
                }
                resolve()
            })
    })
}

exports.getMostRecentTweets = getMostRecentTweets;
exports.correctPassword = correctPassword
exports.getSubscribedTweets = getSubscribedTweets
