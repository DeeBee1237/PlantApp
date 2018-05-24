/**
 * Created by Dragos on 5/17/18.
 *
 * This JS file will contain all the code for ensuring that the client contains
 * a valid name and email address, before they are added to the list:
 */
// for email address validation:
var emailValidator = require('email-validator');

var validateInputField = function (inputFieldContents) {
    return (inputFieldContents.length != 0 &&
        inputFieldContents.trim().length != 0);
};

module.exports = {

    // a valid name means anything that isn't null or empty space:
    validateClientName : function (name) {
        return validateInputField(name);
    },

    validateClientEmail : function (email) {
        return emailValidator.validate(email);
    },

    // this will be used to validate the plant name, location and task
    // input fields on the second page:
    validateTaskInputField : function (taskInputField) {
        return validateInputField(taskInputField);
    }

};

