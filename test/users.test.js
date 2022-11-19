var expect = require("chai").expect;
var request = require("request");

describe("Status and content", function () {
  describe("User page", function () {
    it("status", function (done) {
      request(
        "http://localhost:5000/api/users",
        function (error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
        }
      );
    }, 10_000);

    it("content", function (done) {
      request.post(
        "http://localhost:5000/api/users/login",
        {
          email: "rikasrkf@gmail.com",
          password: "12345",
        },
        function (error, response, body) {
          expect(body).to.equal("{\"success\":false,\"message\":\"Email or Password not found!\"}");
          done();
        }
      );
    }, 10_000);
  });
});