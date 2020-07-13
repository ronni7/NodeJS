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
                    if (detection) {
                        let result = createDetectionResult(detection);
                        fs.writeFileSync(targetPath.split('.')[0] + '.json', JSON.stringify(result));
                    }
                } catch (error) {
                    console.error(error);
                }
            })();
        },
    detectMultipleWithAgeGender:
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
                    detection = await faceapi.detectAllFaces(image).withFaceExpressions().withAgeAndGender();
                    let resultArray = [];
                    if (detection && Array.isArray(detection)) {
                        for (const singleDetection of detection) {
                            let result = createDetectionResult(singleDetection);
                            resultArray.push(result);
                        }
                        if (resultArray && resultArray.length > 0)
                            fs.writeFileSync(targetPath.split('.')[0] + '.json', JSON.stringify(resultArray));
                    }
                } catch (error) {
                    console.error(error);
                }
            })();
        }
};

function createDetectionResult(singleDetection) {
    let result = {};
    result.emotion = {key: 'undefined', value: 0.6};
    if (singleDetection.hasOwnProperty('expressions'))
        for (const [key, value] of Object.entries(singleDetection.expressions))
            if (value > result.emotion.value)
                result.emotion = {key, value};
    if (singleDetection.hasOwnProperty('genderProbability') && singleDetection.hasOwnProperty('gender')) result.gender = singleDetection.genderProbability > 0.6 ? singleDetection.gender : 'unknown';
    if (singleDetection.hasOwnProperty('age') && singleDetection.hasOwnProperty('age')) result.age = Number.isNaN(singleDetection.age) ? -1 : Math.round(singleDetection.age);
    return result;
}
