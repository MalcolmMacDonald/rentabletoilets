const toiletDetector = require('./toiletdetector');
const kijijiScraper = require('./kijiji');
const twitter = require('./twitter.js');
const fs = require('fs');
const { imag } = require('@tensorflow/tfjs-node');


if (!fs.existsSync('./ad-images/')) {
    fs.mkdirSync('./ad-images/');
}


var testJSON = {
    toiletPaths: ['./ad-images/adImage0.jpg', './ad-images/adImage1.jpg']
}

postRecentAds();



async function postRecentAds() {
    await toiletDetector.loadModel();

    var recentAds = await kijijiScraper.getRecentAds();
    for (var i = 0; i < recentAds.length; i++) {
        recentAds[i] = await getToiletImages(recentAds[i]);

        await twitter.tweetImage(recentAds[i]);
        console.log("Test, tweeting first images from ad " + i);

        console.log("Paths with toilets: " + recentAds[i].toiletPaths);
    }



    await fs.readdir('./ad-images/', (err, files) => {
        for (const file of files) {
            fs.unlink('./ad-images/' + file, err => {

            });
        }
    });

}


async function getToiletImages(ad, callback) {
    var newAd = await kijijiScraper.getImages(ad);
    return await toiletDetector.getPathsWithToilets(newAd);
}


