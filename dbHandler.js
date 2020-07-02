

function getMostRecentTweets(db) {
    let posts = [];
    return new Promise((resolve, reject) => {
        let sqlQuery = 'SELECT tresc FROM wpis ORDER BY timestamp DESC LIMIT 5;'
        db.all(sqlQuery, (err, rows) => {
                if(err) {
                    reject(new Error('Internal error while extracting last 5 tweets.'))
                    return;
                }
                console.log('got ', rows)
                for(let row of rows) {
                    posts.push(row.tresc)
                }
                resolve(posts)
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
exports.addPost = addPost;