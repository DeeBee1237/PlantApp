/**
 * Created by Dragos on 5/31/18.
 */
var express =  require('express');
var router = express.Router();

var clientList = {};
var notes = "";

var clientEmailer = require('../public/javascripts/ClientEmailer');

router.get('/', function (req, res) {
    var data = JSON.parse(req.query.data);
    // get the client email and name data ready:
    clientList = data.clientDetails;
    notes = data.notes;

    // TODO creat JS module to send all clients and email with the notes
    clientEmailer.sendEmails(clientList,notes);

    res.send("Your clients have been emailed :)");

});

module.exports = router;