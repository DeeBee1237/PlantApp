/**
 * Created by Dragos on 5/17/18.
 */

var assert = require("assert")

var request = require("supertest")
var app = require("../../app");
var index = require("../../routes/index");

//
describe('open App', function() {
    it('welcomes the user', function(done) {
        request(app).get("/")
            .expect(200)
            .expect(/Welcome to Plant Notes/)
            .expect(/Clients/)
            .expect(/you have not yet added any clients/,done);
    });
});

describe('add no client name',function (){
    it ('adds a client without filling in the name or email fields',function (done) {
        request(app).post("/addingClient")
            .send({clientName : "", clientEmail : ""})
            .expect(200)
            .expect(/Invalid Client name/,done);
    });
});

describe('add empty client name',function () {
    it('adds an empty space client name, and leaves the email form blank',function (done) {
        request(app).post('/addingClient')
            .send({clientName:"  ", clientEmail : ""})
            .expect(/Invalid Client name/,done);
    });
});


describe('add valid name but skip email form',function () {
    it('adds a valid client name, and leaves the email form blank',function (done) {
        request(app).post('/addingClient')
            .send({clientName:"validName", clientEmail : ""})
            .expect(/validName/) // we want to ensure that the fields remain filled
            .expect(/Invalid Client email/,done);
    });
});


describe('add valid name but empty space email',function () {
    it('adds a valid client name, and enters an empty email',function (done) {
        request(app).post('/addingClient')
            .send({clientName:"validName", clientEmail : "  "})
            .expect(/validName/)
            .expect(/Invalid Client email/,done);
    });
});

describe('add valid name but invalid email',function () {
    it('adds a valid client name, and an email with no @...',function (done) {
        request(app).post('/addingClient')
            .send({clientName:"validName", clientEmail : "invalidemail"})
            .expect(/validName/)
            .expect(/invalidemail/)
            .expect(/Invalid Client email/,done);
    });
});

describe('add valid name but partial email',function () {
    it('adds a valid client name, and enters an email with @ but no domain',function (done) {
        request(app).post('/addingClient')
            .send({clientName:"validName123", clientEmail : "invalidemail@"})
            .expect(/validName123/)
            .expect(/invalidemail@/)
            .expect(/Invalid Client email/,done);
    });
});

describe('add valid name but another incomplete email',function () {
    it('adds a valid client name, and leaves the email form partially complete',function (done) {
        request(app).post('/addingClient')
            .send({clientName:"validName234", clientEmail : "invalidemail@.com"})
            .expect(/validName234/)
            .expect(/invalidemail@.com/)
            .expect(/Invalid Client email/,done);
    });
});

// TODO find out how to use assertNot() or something similar
describe('add name and email',function () {
    it('adds a valid client name, and email',function (done) {
        request(app).post('/addingClient')
            .send({clientName:"validName", clientEmail : "valid@gmail.com"})
            .expect(/name : validName/)
            .expect(/email : valid@gmail.com/,done);
    });
});


// TODO write tests for deleting users:
//
// describe('delete a client from the list',function () {
//     it ('delete all clients one by one from a list of two',function (done) {
//         var server = request(app);
//
//         server.post('/addingClient')
//             .send({clientName:"client1", clientEmail : "valid1@gmail.com"});
//
//         server.post('/addingClient')
//             .send({clientName:"client2", clientEmail : "valid2@gmail.com"});
//             // .expect(app.res.clientList.length == 2)
//         server.post('/deleteUser?userID=0') // delete the first
//             .expect(/client2/)
//             .expect(/valid2@gmail.com/,done);
//     });
// });