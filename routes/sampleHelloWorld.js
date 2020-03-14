var express = require('express');
var router = express.Router();

router.get('/hello', function (req, res, next) {
   // res.send('Hello World!');
    res.send({name: 'Johnny', age: 24});
});
module.exports = router;