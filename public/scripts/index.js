

let response = fetch('/requestTweets')
response.then(
    async function (res) {
        console.log('chce cos dostac')
        const tweets = await res.json()

        console.log('tweets scrypcie', tweets)
        for(const tweet of tweets) {
            const row = "<li>" + tweet + "</li>";
            document.getElementById("list").innerHTML += row;
        }
    }
)
