/**
 * Created by Dragos on 5/31/18.
 */
var express =  require('express');
var router = express.Router();

var clientList = {};
var notes = "";

router.get('/', function (req, res) {
    var query = req.query;
    var queryData = query.data.split(":");

    // get the client email and name data ready:
    clientList = JSON.parse(queryData[0]);
    notes = JSON.parse(queryData[1].notes);

});

module.exports = router;