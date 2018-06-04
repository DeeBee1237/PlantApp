/**
 * Created by Dragos on 6/1/18.
 *
 * The role of this module is to email a list of clients with the notes
 * generated by the user
 */

module.exports = {

    sendEmails : function (clientDetails, notes) {
        console.log("=================================");
        for (var i = 0; i < clientDetails.length; i++) {
            var currentClient = clientDetails[i];

            var clientName = currentClient.name;
            var clientEmail = currentClient.email;

            var body = "Hello " + clientName + ". The following details your landscaping plan for the week : \n\n" +
                    notes;

            // TODO replace this with an emailing action when I have an SMTP server ...
            console.log("Sending email ... \n" + "Name : " + clientName + "\n Email: " + clientEmail + " \n Notes : " + body);

        }
        console.log("=================================");

    }
};