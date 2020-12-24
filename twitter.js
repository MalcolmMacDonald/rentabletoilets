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

    tweetImage: async function (ad) {
        var b64ContentArray = ad.toiletPaths.map(url => fs.readFileSync(url, { encoding: 'base64' }));
        var totalFileSize = ad.toiletPaths.map(url => fs.statSync(url).size).reduce((a, b) => a + b, 0);

        return new Promise(resolve => {

            T.post('media/upload', { command: 'INIT', total_bytes: totalFileSize, media_type: 'image/jpeg' }, function (err1, data1, response1) {
                var originalMediaID = data1.media_id;
                T.post('media/upload', { media_data: b64ContentArray[0], media_id: originalMediaID, command: 'APPEND', segment_index: 0 }, function (err2, data2, response2) {

                    T.post('media/upload', { media_data: b64ContentArray[1], media_id: originalMediaID, command: 'APPEND', segment_index: 1 }, function (err3, data3, response3) {

                        T.post('media/upload', { command: 'FINALIZE', media_id: originalMediaID }, function (err4, data4, response4) {



                            var mediaIdStr = data4.media_id_string;
                            var altText = "Kijiji toilet";
                            var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }


                            T.post('media/metadata/create', meta_params, function (err, data, response) {
                                if (!err) {
                                    // now we can reference the media and post a tweet (media will attach to the tweet)
                                    var params = { status: '', media_ids: [mediaIdStr] }

                                    T.post('statuses/update', params, function (err, data, response) {
                                        resolve();
                                    })
                                }
                            });
                        });
                    });
                });
            });
        });
    }
}