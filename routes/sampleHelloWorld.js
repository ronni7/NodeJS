const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
module.exports = router;
router.get('/hello', function (req, res, next) {
    res.send({name: 'Johnny', age: 24});
});

router.get('/helloWithParams', function (req, res, next) {
    res.send({responseBody: req.query});
});

router.post('/post', function (req, res, next) {
    res.send({responseBody: req && req.body ? req.body : 'NotFound'});
});

router.post('/uploadImage', function (req, res, next) {
    req.send('OK');
});
const upload = multer({
    dest: "/storedFiles/images"
});

router.post(
    "/upload",
    upload.single(""),
    (req, res) => {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "/../storedFiles/images/image.png");
        if (!req.file) {
            return res.status(401).json({error: 'Please provide an image'});
        }
        fs.readFile(tempPath, function (err, data) {
            fs.writeFile(targetPath, data, function (err) {
                console.error(err);
            })
        });
        res.status(200).json({name: req.file.filename});
        res.send();
           }
);
