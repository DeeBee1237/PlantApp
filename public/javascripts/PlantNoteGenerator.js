/**
 * This will be responsible for creating a list of all the plant tasks
 * Created by Dragos on 5/23/18.
 */

var getWeekDayStringFromNumber = function (index) {

    // TODO only create and load array once ...
    var weekday = new Array(7);
    weekday[0]="Monday";
    weekday[1]="Tuesday";
    weekday[2]="Wednesday";
    weekday[3]="Thursday";
    weekday[4]="Friday";
    weekday[5]="Saturday";
    weekday[6]="Sunday";

    return weekday[index];
};

var getTimeStringFromNumber = function (index) {

    // TODO only create and load array once ...
    var times = new Array(3);
    times[0]="Morning";
    times[1]="Midday";
    times[2]="Afternoon";

    return times[index];
};

// this will create a 2D array with week days as the rows and
// morning, midday, arvo as the columns. Each cell will have a list of tasks:

var generateTaskMatrix = function (plantTaskList) {

    // initialize it:
    var taskMatrix = new Array(7);
    for (var i = 0; i < 7; i ++) {
        taskMatrix[i] = new Array(3);
    }

    for (var i = 0; i < plantTaskList.length; i++) {

        var currentJSONTask = plantTaskList[i];

        var day = currentJSONTask["day"];
        var time = currentJSONTask["time"];

        // keep only the relevant task info and add it to the matrix:
        // delete currentJSONTask["day"];
        // delete currentJSONTask["time"];

        var currentTaskListAtPosition = taskMatrix[day][time];
        if (currentTaskListAtPosition == undefined)
            taskMatrix[day][time] = [currentJSONTask];
        else
            currentTaskListAtPosition.push(currentJSONTask);
    }

    return taskMatrix;

};

module.exports = {

    generatePlantNotes : function (plantTaskList) {

        var plantNotes = "";

        // var newList = plantTaskList.slice();
        var taskMatrix = generateTaskMatrix(plantTaskList);

        for (var weekDay = 0; weekDay < 7; weekDay++) {

            var weekDayStr = getWeekDayStringFromNumber(weekDay);
            var todoForWeekDay = "";

            for (var time = 0; time < 3; time++) {

                var timeStr = getTimeStringFromNumber(time);

                var taskList = taskMatrix[weekDay][time];

                // if there is no task list:
                if (taskList == undefined)
                    continue;

                todoForWeekDay +=  timeStr + ": \n\n";

                for (var t=0; t<taskList.length; t++) {

                    var currentTask = taskList[t];

                    var plant = currentTask["plant"];
                    var location = currentTask["location"];
                    var taskToDo = currentTask["task"];

                    todoForWeekDay += plant + "\n" + location + "\n" + taskToDo + "\n\n";
                }
            }

            // done with this week day, lets add it to the notes:
            if (todoForWeekDay.length > 0)
                plantNotes += weekDayStr + ": \n\n" + todoForWeekDay;
        }


        return plantNotes;

    }

};

