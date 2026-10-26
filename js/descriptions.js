function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	for (const tweet of runkeeper_tweets) {
		const parsed = new Tweet(tweet.text, tweet.created_at);
		if (parsed.written) {
			written_tweets.push(parsed);
		}
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('textFilter').addEventListener('input', function () {
		const searchText = document.getElementById('textFilter').value;
		const tableBody = document.getElementById('tweetTable');
 
		if (searchText == '') {
			document.getElementById('searchCount').innerText = 0;
			document.getElementById('searchText').innerText = '';
			tableBody.innerHTML = '';
			return;
		}
 
		let rows = '';
		let count = 0;
		for (const tweet of written_tweets) {
			if (tweet.writtenText.toLowerCase().includes(searchText.toLowerCase())) {
				count++;
				rows += tweet.getHTMLTableRow(count);
			}
		}
 
		document.getElementById('searchCount').innerText = count;
		document.getElementById('searchText').innerText = searchText;
		tableBody.innerHTML = rows;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});