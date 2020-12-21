const toiletDetector = require('./toiletdetector');
const kijijiScraper = require('./kijiji');
const { imag } = require('@tensorflow/tfjs-node');
const testURL = "https://www.kijiji.ca/v-apartments-condos/vancouver/1750-525-sq-ft-1feb-furnished-studio-den-yaletown-501-pacific/1541678898";


kijijiScraper.getRecentAds((ads) => {
    for (var i = 0; i < ads.length; i++) {
        getToiletImages(ads[i], (ad) => {
            console.log("Paths with toilets: " + ad.toiletPaths);
        });
    }
});
//getToiletImages(testURL, (pathsWithToilets) => {
//    
//});




function getToiletImages(ad, callback) {
    kijijiScraper.getImages(ad, (imagePaths) => {
        toiletDetector.getPathsWithToilets(imagePaths, (pathsWithToilets) => {
            callback(pathsWithToilets);
        });
    });
}


