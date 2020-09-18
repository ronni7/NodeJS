const request = require("request");
const fs = require('fs');
const fileServiceURL = 'http://localhost:3000/fileService/';
const filename = 'stockMan.jpg';
const path = './spec/' + filename;

//upload method
describe("POST /fileService/upload", function () {
    beforeEach(function () {
        //we start express app here
        require("../app.js");
    });

    it("POST /fileService/upload no image", function (done) {
        request.post({
                url: "http://localhost:3000/fileService/upload",
                formData: {}
            },
            function (error, response) {
                expect(response.statusCode).toBe(400);
                expect(JSON.parse(response.body)).toBeDefined();
                expect(JSON.parse(response.body).error).toBe('Please provide any image file');
                done();
            }
        );
    });

    it("POST /fileService/upload file corrupted" , function (done) {
        request.post({
                url: "http://localhost:3000/fileService/upload",
                formData: {file:[].fill(20,0,20)}
            },
            function (error, response) {
                expect(response.statusCode).toBe(400);
                expect(JSON.parse(response.body)).toBeDefined();
                expect(JSON.parse(response.body).error).toBe('File corrupted');
                done();
            }
        );
    });

});
