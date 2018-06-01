/**
 * Created by Dragos on 5/31/18.
 */
var express =  require('express');
var router = express.Router();

var clientList = {};
var notes = "";

router.get('/', function (req, res) {
    var data = JSON.parse(req.query.data);
    // get the client email and name data ready:
    clientList = data.clientDetails;
    notes = data.notes;

    // TODO creat JS module to send all clients and email with the notes

    res.send("Your clients have been emailed :)");

});

module.exports = router;