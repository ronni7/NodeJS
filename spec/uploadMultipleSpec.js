const request = require("request");

describe("POST /fileService/upload", function () {
    beforeEach(function () {
        //we start express app here
        require("../app.js");
    });

    it("POST /fileService/detectMultiple no image", function (done) {
        request.post({
                url: "http://localhost:3000/fileService/detectMultiple",
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

    it("POST /fileService/detectMultiple file corrupted" , function (done) {
        request.post({
                url: "http://localhost:3000/fileService/detectMultiple",
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
