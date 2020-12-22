const toiletDetector = require('./toiletdetector');
const kijijiScraper = require('./kijiji');
const fs = require('fs');
const { imag } = require('@tensorflow/tfjs-node');

const testURL = "https://www.kijiji.ca/v-apartments-condos/vancouver/1750-525-sq-ft-1feb-furnished-studio-den-yaletown-501-pacific/1541678898";


postRecentAds();



async function postRecentAds() {
    await toiletDetector.loadModel();

    var recentAds = await kijijiScraper.getRecentAds();
    for (var i = 0; i < recentAds.length; i++) {
        recentAds[i] = await getToiletImages(recentAds[i]);
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


