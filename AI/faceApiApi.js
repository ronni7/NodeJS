const faceapi = require("face-api.js");
const canvas = require("canvas");
const fs = require("fs");

const {Canvas, Image, ImageData} = canvas
faceapi.env.monkeyPatch({Canvas, Image, ImageData})
module.exports = {
    detectSingleWithAgeGender:
        function (sourceImg, targetPath) {
            let detection = {};
            (async () => {
                await faceapi.nets.ssdMobilenetv1.loadFromDisk('./AI/weights');
                await faceapi.nets.faceLandmark68Net.loadFromDisk('./AI/weights');
                await faceapi.nets.faceExpressionNet.loadFromDisk('./AI/weights');
                await faceapi.nets.ageGenderNet.loadFromDisk('./AI/weights');
                try {
                    const image = new Image();
                    image.src = sourceImg;
                    detection = await faceapi.detectSingleFace(image).withFaceExpressions().withAgeAndGender();
                    let result = {};
                    if (detection) {
                        result.emotion = {key: 'undefined', value: 0.6};
                        if (detection.hasOwnProperty('expressions')) {
                            for (const [key, value] of Object.entries(detection.expressions)) {
                                if (value > result.emotion.value) {
                                    result.emotion = {key, value};
                                }
                            }
                        }
                        if (detection.hasOwnProperty('genderProbability') && detection.hasOwnProperty('gender')) result.gender = detection.genderProbability > 0.6 ? detection.gender : 'unknown';
                        if (detection.hasOwnProperty('age') && detection.hasOwnProperty('age')) result.age = Number.isNaN(detection.age) ? -1 : Math.round(detection.age);
                        fs.writeFileSync(targetPath.split('.')[0] + '.json', JSON.stringify(result));
                    }
                } catch (error) {
                    console.error(error);
                }
            })();
        }
};

