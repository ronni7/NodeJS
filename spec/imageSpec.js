//spec/HelloSpec.js
const request = require("request");
const fileServiceURL = 'http://localhost:3000/fileService/';

//image method
describe("GET /fileService/image", function () {
    beforeEach(function () {
        //we start express app here
        require("../app.js");
    });

    const incorrectParam = 'filename=random-uuid';
    it("returns 404 error code, because provided filename is incorrect, and there is no such file stored by server", function (done) {
        request(fileServiceURL + "image" + '?' + incorrectParam, function (error, response, html) {
            expect(response.statusCode).toBe(404);
            expect(JSON.parse(response.body).error).toBeDefined();
            done();
        });
    });
    it("returns 400 error code, because no filename has been provided", function (done) {
        request(fileServiceURL + "image", function (error, response, html) {
            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).error).toBeDefined();
            done();
        });
    });
    const correctParam = 'filename=image.png';
    it("returns 404 error code, because provided filename is incorrect, and there is no such file stored by server", function (done) {
        request(fileServiceURL + "image" + '?' + correctParam, function (error, response, html) {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.body)).toBeDefined();
            done();
        });
    });
});
