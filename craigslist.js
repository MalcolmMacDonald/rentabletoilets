//https://gist.github.com/corydolphin/5499578

var cheerio = require('cheerio')
    , request = require('request');


module.exports = {

    parsePage: function (url, callback) {
        request(url, function (err, resp, body) {
            if (err) {
                callback(err);
                return
            }
            $ = cheerio.load(body);
            var listing_title = $('.postingtitle').text().trim();
            var image_links = $('img').map(function (i, el) {
                return $(this).attr('src');
            });
            var listing_description = $('#postingbody').text();
            var listing_latitude = $('#leaflet').attr('data-latitude');
            var listing_longitude = $('#leaflet').attr('data-longitude');


            var listing_id = $('.postinginfos p.postinginfo').first().text().match(/\d+/g)[0]; //grab digit group

            var listing_datestamp = $('.postinginfos p.postinginfo > date').first().attr('title');

            callback(false, {
                title: listing_title,
                description: listing_description,
                images: image_links,
                latitude: listing_latitude,
                longitude: listing_longitude,
                postTime: listing_datestamp,
                id: listing_id
            })
        });
    }
}
