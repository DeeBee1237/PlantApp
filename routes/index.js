var express = require('express');
var router = express.Router();

// keep a list of all the clients added in this session:
var clients = [];

// send this JSON along with the view that we respond with to client connection requests:
var objectToSendWithView = { title: 'Welcome to Plant Notes, Kiri', clientList:clients,
    invalid : "", prevName : "", prevEmail : ""};


// for validating the clients:
var clientValidator = require("../public/javascripts/Validator");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', objectToSendWithView);
});

// This function will be called because either the name or email of the client
// was invalid, and they need to be given a warning:
var sendInvalidMessage = function(response,invalidField,previousClient) {
    // which field is invalid ? the name or email ?
    objectToSendWithView["invalid"] = invalidField;

    objectToSendWithView["prevName"] = previousClient.name;
    objectToSendWithView["prevEmail"] = previousClient.email;

    response.render('index',objectToSendWithView);

    objectToSendWithView["invalid"] = "";
    objectToSendWithView["prevName"] = "";
    objectToSendWithView["prevEmail"] = "";
};


// when the home page gets a request to add a client to the
// the list of clients to email the notes to:
router.post("/addingClient",function (req,res) {
    var body = req.body;

    var nameOfClient = body.clientName;
    var clientEmail = body.clientEmail;


    // send the name and client email back to the index page if they are
    // invalid, so the user doesn't have to retype them:
    var clientJSON = {"name" : nameOfClient, "email" : clientEmail};

    if (!clientValidator.validateClientName(nameOfClient)) {
        sendInvalidMessage(res,"name",clientJSON);
        return;
    }

    if (!clientValidator.validateClientEmail(clientEmail)) {
        sendInvalidMessage(res,"email",clientJSON);
        return;
    }

    clients.push(clientJSON);

    res.render('index',objectToSendWithView);
});

router.post("/deleteUser",function (req,res) {
    // obtain the users unique ID and remove them from the client list:
    var userToDeleteID = req.query.userID;
    clients.splice(userToDeleteID,1);

    // update the clients view:
    res.render('index',objectToSendWithView);
});

// when the clients are all added, and we can proceed to note writing:
router.post("/goToNotesPage",function (req,res) {
    // do not let the user move on to the notes page, unless they
    // have at least one client:
    if (clients.length == 0) {
        objectToSendWithView["invalid"] = "clientList";
        res.render('index',objectToSendWithView);
        objectToSendWithView["invalid"] = ""; // reset the invalid field
    }

    else
        res.redirect('/typeClientNotes?clientsToEmail=' + clients);
});


module.exports = router;
