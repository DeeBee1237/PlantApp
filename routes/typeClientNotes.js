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

// TODO send these to the emailCLients route:
var latestNotes = "";
var clientEmailDetails = {};

// TODO create a view for this screen and email all the users at the end
router.get('/',function (req,res,next) {
    // req.body.query;
    var clients = req.query.clientsToEmail;
    clientEmailDetails = clients;

    // var responseString = "";
    // for (var i = 0; i < clients.length; i++){
    //     var client = clients[i];
    //
    //     var name = client.name;
    //     var email = client.email;
    //
    //    responseString += ("Client: " + name + " , "  + email);
    // }

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

router.post("/addTask",function (req,res) {
    var body = req.body;

    var day = body.dayForTask;
    var time = body.time;

    var plant = body.plant;
    var location = body.location;
    var task = body.task;

    var plantTaskJSON = {day : day, time : time, plant : plant,
        location : location, task : task};

    sendWithResponse =  Object.assign(sendWithResponse,plantTaskJSON);

    // validate the input fields:
    var fieldValidationValue = validateInputFields(plantTaskJSON);
    if (fieldValidationValue != "") {
        // show the error:
        sendWithResponse.invalidFieldName =  fieldValidationValue;
        // TODO if any of the fields are invalid, then save the fields that have been entered:
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

    res.redirect("/emailClients?data=" + JSON.stringify(clientEmailDetails) + ":" + JSON.stringify({notes : latestNotes}));
        // +"latestNotes="+latestNotes);
});

module.exports = router;
