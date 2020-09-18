//spec/HelloSpec.js
const request = require("request");
const fileServiceURL = 'http://localhost:3000/fileService/';
//hello method
describe("GET /fileService/hello", function () {
    beforeEach(function () {
        //we start express app here
        require("../app.js");
    });


    //note 'done' callback, needed as request is asynchronous
    it("returns hello!", function (done) {
        request(fileServiceURL + "hello", function (error, response, html) {
            expect(html).toBe("hello!");
            done();
        });
    });


});
