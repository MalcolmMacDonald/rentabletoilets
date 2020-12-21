const cocoSsd = require('@tensorflow-models/coco-ssd');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const modelUrl = 'https://tfhub.dev/tensorflow/tfjs-model/ssdlite_mobilenet_v2/1/default/1';

module.exports = {

    loadModel: async function () {
        return cocoSsd.load().then((laodedModel) => model = laodedModel);
    },
    // Load the Coco SSD model and image.
    containsToilet: async function (adImagePath) {
        return Promise.all([fs.readFile(adImagePath)])
            .then((results) => {
                // First result is the COCO-SSD model object.
                // Second result is image buffer.
                const imgTensor = tf.node.decodeImage(new Uint8Array(results[0]), 3);
                // Call detect() to run inference.
                return model.detect(imgTensor);
            })
            .then((predictions) => {
                console.log(JSON.stringify(predictions, null, 2));
                if (predictions.some((predition) => predition.class == 'toilet')) {
                    return adImagePath;
                }
            });
    },
    getPathsWithToilets: async function (ad, callback) {
        var pathsWithToilets = [];
        var toiletCheckPromises = [];
        for (var i = 0; i < ad.imagePaths.length; i++) {
            toiletCheckPromises.push(this.containsToilet(ad.imagePaths[i])
                .then((toiletPath) => {
                    if (toiletPath) {
                        pathsWithToilets.push(toiletPath)
                    }
                }));
        }

        await Promise.all(toiletCheckPromises);
        ad.toiletPaths = pathsWithToilets;
        return ad;
    }
}