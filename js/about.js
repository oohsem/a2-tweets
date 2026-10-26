function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	let earliest = tweet_array[0].time;
	let latest = tweet_array[0].time;
	let completed = 0;
	let live = 0;
	let achievements = 0;
	let miscellaneous = 0;
	let written = 0;
 
	for (const tweet of tweet_array) {
		if (tweet.time < earliest) {
			earliest = tweet.time;
		}
		if (tweet.time > latest) {
			latest = tweet.time;
		}
 
		if (tweet.source == 'completed_event') {
			completed++;
			if (tweet.written) {
				written++;
			}
		} else if (tweet.source == 'live_event') {
			live++;
		} else if (tweet.source == 'achievement') {
			achievements++;
		} else {
			miscellaneous++;
		}
	}
 
	const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-US', dateFormat);
	document.getElementById('lastDate').innerText = latest.toLocaleDateString('en-US', dateFormat);
 
	const total = tweet_array.length;
	const format = { notation: 'fixed', precision: 2 };
	const values = {
		completedEvents: completed,
		completedEventsPct: math.format(completed / total * 100, format) + '%',
		liveEvents: live,
		liveEventsPct: math.format(live / total * 100, format) + '%',
		achievements: achievements,
		achievementsPct: math.format(achievements / total * 100, format) + '%',
		miscellaneous: miscellaneous,
		miscellaneousPct: math.format(miscellaneous / total * 100, format) + '%',
		written: written,
		writtenPct: math.format(written / completed * 100, format) + '%'
	};
 
	for (const className in values) {
		for (const element of document.getElementsByClassName(className)) {
			element.innerText = values[className];
		}
	}  
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});