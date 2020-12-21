const scraper = require('kijiji-scraper');
const axios = require('axios');
const fs = require('fs');
const { scrape } = require('kijiji-scraper/dist/lib/scraper');
const { data } = require('@tensorflow/tfjs-node');
const searchParams = {
    locationId: 1700287,
    categoryId: 37,
    sortType: "DATE_DESCENDING"
}

async function downloadImage(url, path) {
    const writer = fs.createWriteStream(path)

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return await new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

module.exports = {
    getImages: async function (ad, callback) {
        var allPaths = [];

        var allPromises = [];
        for (var i = 0; i < ad.images.length; i++) {
            console.log("Image " + i);
            var thisPath = './ad-images/adImage' + i + '.jpg';
            allPaths.push(thisPath);
            allPromises.push(downloadImage(ad.images[i], thisPath));
        }
        await Promise.all(allPromises);
        ad.imagePaths = allPaths;

        console.log("Done downloading images");
        return ad;
    },
    getRecentAds: function (callback) {
        return scraper.search(searchParams)
            .then((allAds) => {

                var currentDate = new Date();
                var recentAds = allAds.filter((ad) => {
                    var adDate = ad.date;
                    var msDiff = currentDate - adDate;
                    var minutesDiff = (msDiff / (1000 * 60)).toFixed(1);

                    return minutesDiff < 60;
                });

                return recentAds;
            });
    }
}