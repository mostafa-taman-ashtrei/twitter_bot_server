/* eslint-disable import/prefer-default-export */
import Twitter from 'twitter';
import { WordTokenizer, SentimentAnalyzer, PorterStemmer } from 'natural';
import sw from 'stopword';

import config from '../config/keys';
import convertToLex from '../utils/convertToLex';

const T = new Twitter(config);

const preprocessTweet = (tweet: string) => {
    const tokenizer = new WordTokenizer();

    const lexedTweet = convertToLex(tweet);
    const lowerCasedTweet = lexedTweet.toLowerCase();
    const alphaOnlyTweet = lowerCasedTweet.replace(/[^a-zA-Z\s]+/g, '');
    const tokinizedTweet = tokenizer.tokenize(alphaOnlyTweet);
    const noStopWordsTweet = sw.removeStopwords(tokinizedTweet);

    return noStopWordsTweet;
};

const getTweetSentiment = (tweet: string) => {
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const preprocessedTweet = preprocessTweet(tweet);
    const analysis = analyzer.getSentiment(preprocessedTweet);
    let result = '';

    if (analysis < 0) result = `negative 😢 ${analysis} ${tweet}`;
    if (analysis === 0) result = `neutral 😐 ${analysis} ${tweet}`;
    if (analysis > 0) result = `positive 😃 ${analysis} ${tweet}`;
    return result;
};

const getTweets = (params: {}): Promise<string[]> => new Promise((resolve, reject) => {
    T.get('search/tweets', params, (error, tweets) => {
        if (error) reject(error);
        const data: any[] = [];
        tweets.statuses.map((tweet: any) => {
            data.push(tweet.text);
        });
        return resolve(data);
    });
});

export const search = async (q: string) => {
    const params = { q, count: 10, include_entities: true };
    const tweets = await getTweets(params);
    const data = tweets.map((tweet) => {
        console.log(getTweetSentiment(tweet));
        return getTweetSentiment(tweet);
    });
    return data;
};
