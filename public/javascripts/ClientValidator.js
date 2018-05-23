/**
 * Created by Dragos on 5/17/18.
 *
 * This JS file will contain all the code for ensuring that the client contains
 * a valid name and email address, before they are added to the list:
 */
// for email address validation:
var emailValidator = require('email-validator');

module.exports = {

    // a valid name means anything that isn't null or empty space:
    validateClientName : function (name) {
        return (name.length != 0 && name.trim().length != 0);
    },

    validateClientEmail : function (email) {
        return emailValidator.validate(email);
    }

};

