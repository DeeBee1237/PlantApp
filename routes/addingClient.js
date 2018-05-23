/**
 * Created by Dragos on 5/18/18.
 */
var express = require('express');
var router = express.Router();

// send this JSON along with the view that we respond with to client connection requests:
var objectToSendWithView = { title: 'Welcome to Plant Notes', clientList:clients,
    invalid : ""};

// keep a list of all the clients added in this session:
var clients = [];

// This function will be called because either the name or email of the client
// was invalid, and they need to be given a warning:
var sendInvalidMessage = function(response,invalidField) {
    // which field is invalid ? the name or email ?
    objectToSendWithView["invalid"] = invalidField;
    response.render('index',objectToSendWithView);
    objectToSendWithView["invalid"] = "";
};


router.post("/addingClient",function (req,res) {
    var body = req.body;

    var nameOfClient = body.clientName;
    var clientEmail = body.clientEmail;

    // TODO : prevent from being able to add the exact same user twice
    // TODO : and display a good error message

    if (!clientValidator.validateClientName(nameOfClient)) {
        sendInvalidMessage(res,"name");
        return;
    }

    if (!clientValidator.validateClientEmail(clientEmail)) {
        sendInvalidMessage(res,"email");
        return;
    }

    var clientJSON = {"name" : nameOfClient, "email" : clientEmail};
    clients.push(clientJSON);

    res.render('index',objectToSendWithView);
});

module.exports = router;