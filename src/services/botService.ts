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

    if (analysis < 0) console.log(`negative 😢 ${analysis} => ${tweet}`);
    if (analysis === 0) console.log(`neutral 😐 ${analysis} => ${tweet}`);
    if (analysis > 0) console.log(`positive 😃 ${analysis} => ${tweet}`);

    return analysis;
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

export const search = async (q: string, count: number) => {
    const params = { q, count, include_entities: true };
    const tweets = await getTweets(params);

    let positve = 0;
    let negative = 0;
    let neutral = 0;

    tweets.map((tweet) => {
        const analysis = getTweetSentiment(tweet);

        if (analysis < 0) negative += 1;
        if (analysis === 0) neutral += 1;
        if (analysis > 0) positve += 1;
    });

    return { neutral, negative, positve };
};
