class Tweet {
    private text:string;
	time:Date;
    constructor(tweet_text: string, tweet_time: string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source() {
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted") || this.text.startsWith("Completed a")) {
            return "completed_event";
        }
        if (this.text.startsWith("Watch my")) {
            return "live_event";
        }
        if (this.text.includes("personal record") || this.text.startsWith("I just set a goal")) {
            return "achievement";
        }
        return "miscellaneous";
    }
    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written() {
        return this.writtenText != "";
    }

    get writtenText() {
        if (this.source != "completed_event") {
            return "";
        }
 
        let text = this.text.split(" https://t.co/")[0];
        text = text.replace(/#runkeeper/gi, "").trim();
 
        if (text.includes("Check it out!")) {
            return "";
        }
 
        const dashPosition = text.indexOf(" - ");
        if (dashPosition == -1) {
            return "";
        }
 
        const userText = text.substring(dashPosition + 3).trim();
        if (userText == "TomTom MySports Watch" || userText.startsWith("workout ")) {
            return "";
        }
        return userText;
    }
    get activityType() {
        if (this.source != "completed_event") {
            return "unknown";
        }
 
        const words = this.text.split(" ");
        let i = 3;
        if (this.text.startsWith("Completed")) {
            i = 2;
        }
 
        if (!isNaN(Number(words[i])) && (words[i + 1] == "km" || words[i + 1] == "mi")) {
            i = i + 2;
        }
 
        const activityWords: string[] = [];
        const stopWords = ["with", "in", "@", "-"];
        while (i < words.length && !stopWords.includes(words[i]) && !words[i].startsWith("http")) {
            activityWords.push(words[i]);
            i++;
        }
        return activityWords.join(" ").toLowerCase();
    }
    get distance() {
        if (this.source != "completed_event") {
            return 0;
        }
 
        const words = this.text.split(" ");
        let i = 3;
        if (this.text.startsWith("Completed")) {
            i = 2;
        }
        const number = Number(words[i]);
 
        if (isNaN(number)) {
            return 0;
        }
        if (words[i + 1] == "km") {
            return number / 1.609;
        }
        if (words[i + 1] == "mi") {
            return number;
        }
        return 0;
    }
    getHTMLTableRow(rowNumber: number) : string{
        const link = this.text.match(/https:\/\/t\.co\/\S+/);
        let tweetText = this.text;
        if (link) {
            tweetText = this.text.replace(link[0], '<a href="' + link[0] + '">' + link[0] + "</a>");
        }
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + tweetText + "</td></tr>";
    }
}
