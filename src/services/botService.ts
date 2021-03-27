/* eslint-disable import/prefer-default-export */
import Twitter from 'twitter';
import config from '../config/keys';

const T = new Twitter(config);

export const search = async (q: string) => {
    const params = { q, count: 10, include_entities: true };
    T.get('search/tweets', params, (error, tweets) => {
        if (error) console.log(error);
        console.log(tweets.statuses.length);
        tweets.statuses.map((tweet: any) => console.log(tweet.text));
    });
};

export const Tweet = {};
