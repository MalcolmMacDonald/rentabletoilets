require('dotenv').config();
const { all } = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

const config = {

    consumer_key: process.env.consumer_key,

    consumer_secret: process.env.consumer_secret,

    access_token: process.env.access_token,

    access_token_secret: process.env.access_token_secret
}
const twit = require('twit');
const T = new twit(config);


module.exports = {

    tweetImage: function (ad) {
        var b64ContentArray = ad.toiletPaths.map(url => fs.readFileSync(url, { encoding: 'base64' }));
        var totalFileSize = ad.toiletPaths.map(url => fs.statSync(url).size).reduce((a, b) => a + b, 0);

        return new Promise(resolve => {

            T.post('media/upload', { media_data: b64ContentArray[0] }, function (err, data, response) { //ONLY POST THE FIRST PHOTO, THIS IS BECAUSE IM LAZY AND ITS HARD TO POST MULTIPLE PHOTOS
                var splitLocation = ad.attributes.location.split(',')[0];
                var params = { status: splitLocation + '\n\n\n' + ad.url, media_ids: data.media_id_string }

                T.post('statuses/update', params, function (err, data, response) {
                    resolve();
                })

            });
        });
    }
}