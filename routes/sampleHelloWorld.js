const uuidv1 = require('uuid').v1;
const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const upload = multer({
    dest: "/storedFiles/images"
});
module.exports = router;

router.get('/image', function (req, res, next) {
    if (!req.query.filename) {
        res.status(400).json({error: 'Please provide a filename'}).send();
    }
    const filename = req.query.filename;
    const path = __dirname + "/../storedFiles/images/" + filename + ".png";
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            res.status(404).json({error: "File not found"}).send();
        }
        res.send(data);
    })

});

router.post(
    "/upload",
    upload.single(""),
    (req, res) => {
        const tempPath = req.file.path;
        const uuid = uuidv1();
        const targetPath = path.join(__dirname, "/../storedFiles/images/" + uuid + ".png");
        if (!req.file) {
            return res.status(401).json({error: 'Please provide an image'});
        }
        fs.readFile(tempPath, function (err, data) {
            fs.writeFile(targetPath, data, function (err) {
                if (err)
                    console.error(err);
            })
        });
        res.status(200).json({filename: uuid});
        res.send();
    }
);
