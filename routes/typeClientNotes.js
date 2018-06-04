/**
 * Created by Dragos on 5/15/18.
 */
var express = require('express');
var router = express.Router();

var plantNoteGenerator =  require('../public/javascripts/PlantNoteGenerator');

var validator = require('../public/javascripts/Validator');

// a list of all JSON objects received from client tasks:
var plantTaskList = [];

// send this with every response given to the client:
var sendWithResponse = {plantNotes : "", invalidFieldName : "",day : "", time : "", plant : "",
    location : "", task : ""};

//  send these to the emailCLients route:
var latestNotes = "";
var clientEmailDetails = {};

router.get('/',function (req,res,next) {
    // req.body.query;
    var clients = JSON.parse(req.query.clientsToEmail);
    clientEmailDetails = clients;

    res.render('notesPage',sendWithResponse);
});

// take in a json object consisting of all the task info and check if any fields are empty
// if they are, then return the name of the first empty field found
var validateInputFields = function (JSONTask) {

    // get the names of all the inputs:
    var names = Object.keys(JSONTask);

    for (var i in names) {
        var currentFieldName = names[i];
        var currentFieldValue = JSONTask[currentFieldName];

        if (!validator.validateTaskInputField(currentFieldValue))
            return currentFieldName;
    }

    return "";
};

// from the clients request, obtain the information that they
// filled out in the fields and text area, and join it with the
// send to response, so that if there is an error there fields are saved
var obtainPlantTaskDataFromClientRequest = function (req) {
    var body = req.body;

    var day = body.dayForTask;
    var time = body.time;

    var plant = body.plant;
    var location = body.location;
    var task = body.task;

    var plantTaskJSON = {day : day, time : time, plant : plant,
        location : location, task : task};

    sendWithResponse =  Object.assign(sendWithResponse,plantTaskJSON);

    return plantTaskJSON;
};


router.post("/addTask",function (req,res) {
    // var body = req.body;
    //
    // var day = body.dayForTask;
    // var time = body.time;
    //
    // var plant = body.plant;
    // var location = body.location;
    // var task = body.task;
    //
    // var plantTaskJSON = {day : day, time : time, plant : plant,
    //     location : location, task : task};
    //
    // sendWithResponse =  Object.assign(sendWithResponse,plantTaskJSON);

    plantTaskJSON = obtainPlantTaskDataFromClientRequest(req);
    // validate the input fields:
    var fieldValidationValue = validateInputFields(plantTaskJSON);
    if (fieldValidationValue != "") {
        // show the error:
        sendWithResponse.invalidFieldName =  fieldValidationValue;
        res.render('notesPage',sendWithResponse);
        sendWithResponse.invalidFieldName = "";
        return;
    }

    plantTaskList.push(plantTaskJSON);

    latestNotes = plantNoteGenerator.generatePlantNotes(plantTaskList);
    sendWithResponse["plantNotes"] = latestNotes;

    res.render('notesPage',sendWithResponse);
});

router.post("/emailClients", function (req,res) {

    // check if there are no notes first, and display an error message if this is the case
    if (latestNotes.trim().length == 0) {

        // get the data from the client and concat it with the
        // 'send-with-response' JSON object, in order to save all input fields:
        obtainPlantTaskDataFromClientRequest(req);

        sendWithResponse.invalidFieldName = "notes";
        res.render('notesPage',sendWithResponse);
        sendWithResponse.invalidFieldName = "";
        return;
    }

    // redirect the client to the emailing route, and send the email details array
    // as well as the notes string:
    var dataToSendToEmailingRoute = {clientDetails : clientEmailDetails , notes : latestNotes};
    var dataToSendEncoded = JSON.stringify(dataToSendToEmailingRoute);
    res.redirect("/emailClients?data=" + dataToSendEncoded);//JSON.stringify(clientEmailDetails));// + ":" + JSON.stringify({notes : latestNotes}));
});

module.exports = router;
