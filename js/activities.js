function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const countsByType = {};
	for (const tweet of tweet_array) {
		if (tweet.source == 'completed_event') {
			const type = tweet.activityType;
			countsByType[type] = (countsByType[type] || 0) + 1;
		}
	}
 
	const activityCounts = [];
	for (const type in countsByType) {
		activityCounts.push({ activityType: type, count: countsByType[type] });
	}
	activityCounts.sort((a, b) => b.count - a.count);
 
	const topThree = [activityCounts[0].activityType, activityCounts[1].activityType, activityCounts[2].activityType];
 
	document.getElementById('numberActivities').innerText = activityCounts.length;
	document.getElementById('firstMost').innerText = topThree[0];
	document.getElementById('secondMost').innerText = topThree[1];
	document.getElementById('thirdMost').innerText = topThree[2];

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array },
		mark: 'bar',
		encoding: {
			x: { field: 'activityType', type: 'nominal', sort: '-y', title: 'Activity type' },
			y: { field: 'count', type: 'quantitative', title: 'Number of Tweets' }
		}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const distanceData = [];
	for (const tweet of tweet_array) {
		if (tweet.source == 'completed_event' && topThree.includes(tweet.activityType)) {
			distanceData.push({
				activityType: tweet.activityType,
				distance: tweet.distance,
				day: dayNames[tweet.time.getDay()]
			});
		}
	}
 
	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';
 
	distance_vis_spec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		description: 'Distance by day of the week for the three most tweeted activities.',
		data: { values: distanceData },
		mark: 'point',
		encoding: {
			x: { field: 'day', type: 'ordinal', sort: dayNames, title: 'Day of the week' },
			y: { field: 'distance', type: 'quantitative', title: 'Distance (mi)' },
			color: { field: 'activityType', type: 'nominal', title: 'Activity type' }
		}
	};
 
	distance_vis_mean_spec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		description: 'Mean distance by day of the week for the three most tweeted activities.',
		data: { values: distanceData },
		mark: 'point',
		encoding: {
			x: { field: 'day', type: 'ordinal', sort: dayNames, title: 'Day of the week' },
			y: { aggregate: 'mean', field: 'distance', type: 'quantitative', title: 'Mean distance (mi)' },
			color: { field: 'activityType', type: 'nominal', title: 'Activity type' }
		}
	};
 
	vegaEmbed('#distanceVis', distance_vis_spec, { actions: false });
	vegaEmbed('#distanceVisAggregated', distance_vis_mean_spec, { actions: false });
 
	const allChart = document.getElementById('distanceVis');
	const meanChart = document.getElementById('distanceVisAggregated');
	const button = document.getElementById('aggregate');
 
	meanChart.style.display = 'none';
 
	button.addEventListener('click', function () {
		if (meanChart.style.display == 'none') {
			allChart.style.display = 'none';
			meanChart.style.display = 'block';
			button.innerText = 'Show all activities';
		} else {
			allChart.style.display = 'block';
			meanChart.style.display = 'none';
			button.innerText = 'Show means';
		}
	});

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});