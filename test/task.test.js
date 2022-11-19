var expect  = require('chai').expect;
var request = require('request');

describe('Status and content', function() {
    describe ('Tasks page', function() {
        it('status', function(done){
            request('http://localhost:5000/api/tasks', function(error, response, body) {
                expect(response.statusCode).to.equal(401);
                done();
            });
        },10_000);
    })
})