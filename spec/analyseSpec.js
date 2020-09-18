//spec/HelloSpec.js
const request = require("request");
const fileServiceURL = 'http://localhost:3000/fileService/';

//analyse method
describe("GET /fileService/analyse", function () {
    beforeEach(function () {
        //we start express app here
        require("../app.js");
    });

    const incorrectParam = 'filename=random-uuid';
    it("returns 404 error code, because provided filename is incorrect, and there is no such file stored by server", function (done) {
        request(fileServiceURL + "analyse" + '?' + incorrectParam, function (error, response, html) {
            expect(response.statusCode).toBe(404);
            expect(JSON.parse(response.body).error).toBeDefined();
            done();
        });
    });
    it("returns 400 error code, because no filename has been provided", function (done) {
        request(fileServiceURL + "analyse", function (error, response, html) {
            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).error).toBeDefined();
            done();
        });
    });
    const correctParam = 'filename=sampleAnalysis.json';
    it("returns 404 error code, because provided filename is incorrect, and there is no such file stored by server", function (done) {
        request(fileServiceURL + "analyse" + '?' + correctParam, function (error, response, html) {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.body)).toBeDefined();
            done();
        });
    });

});

