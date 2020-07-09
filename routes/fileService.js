const uuidv1 = require('uuid').v1;
const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const faceApi = require('../AI/faceApiApi');

const upload = multer({
    dest: "/storedFiles/images"
});
module.exports = router;
router.get('/hello', function (req, res, next) {
    res.status(200);
    res.send('hello!');
});
router.get('/image', function (req, res, next) {
    if (!req.query.filename) {
        res.status(400).json({error: 'Please provide a filename'}).send();
    }
    const path = __dirname + "/../storedFiles/images/" + req.query.filename;
    fs.readFile(path, (err, data) => {
        if (err) {
            res.status(404).json({error: "File not found"}).send();
        }
        res.send(data);
    })

});

router.get('/analyse', function (req, res, next) {
    if (!req.query.filename) {
        res.status(400).json({error: 'Please provide a filename'}).send();
    }
    const filename = req.query.filename;
    const path = './storedFiles/analyses/' + (filename.split('.').length > 1 ? filename : filename + '.json');
    fs.readFile(path, (err, data) => {
        if (err) {
            res.status(404).json({error: "File not found"}).send();
        }
        res.send(data);
    })

});

function getFileExtension(type) {
    switch (type) {
        /*     case 'svg+xml':
                 return 'svg';*/ // fixme unsuported
        case 'x-icon':
        case 'vnd.microsoft.icon':
            return 'ico';
        default:
            return type;
    }
}

router.post(
    "/upload",
    upload.single(""),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({error: 'Please provide any image file'});
        }
        if (!req.file.mimetype)
            return res.status(400).json({error: 'File corrupted'});
        let mimeTypeParts = req.file.mimetype.split('/');
        if (!mimeTypeParts || mimeTypeParts.length < 1 || mimeTypeParts[0] !== 'image') {
            return res.status(400).json({error: 'Provided file is not an image!'});
        }
        const tempPath = req.file.path;
        const type = '.' + getFileExtension(mimeTypeParts[mimeTypeParts.length - 1]);
        const filename = uuidv1();
        const targetPath = path.join(__dirname, "/../storedFiles/images/" + filename + type);
        fs.readFile(tempPath, function (err, data) {
            fs.writeFile(targetPath, data, function (err) {
                if (err) {
                    return res.status(500).json({error: 'An error occurred during file processing'});
                }
            });
            faceApi.detectSingleWithAgeGender(data, targetPath.replace('images', 'analyses'));
        });
        res.status(200).json({filename: filename, type: type.split('.')[1]}).send();
    }
);
