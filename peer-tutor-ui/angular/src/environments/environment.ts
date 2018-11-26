// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//TODO: change to proper host on production
const host = 'http://35.231.189.173:5000';

export const environment = {
  production: false,
  apipath: {
    /**POST request */
    register: host+"/test/api/register",
    /**POST request */
    login: host+"/test/api/login",

    /**PUT request */
    putStudent: host+"/test/api/student",
    /**GET request, Need to append ***Student ID*** as path parameter */
    getStudentById: host+"/test/api/student/id/",
    /**GET request, Need to append ***Student Name*** as path parameter */
    getStudentsByName: host+"/test/api/student/name/",

    /**GET request, Need to append ***Department Name*** as path parameter */
    getUniClassByDeptName: host+"/test/api/uniclass/department/",
    /**GET request, Need to append ***Instructor Name*** as path parameter */
    getUniClassByInstructName: host+"/test/api/uniclass/instructor/",
    /**GET request, Need to append ***Class Name*** as path parameter */
    getUniClassByClassName: host+"/test/api/uniclass/name/",
    /**GET request, Need to append ***Class Title*** as path parameter */
    getUniClassByClassTitle: host+"/test/api/uniclass/title/",
    /**GET request, Need to append ***Class Code*** as path parameter */
    getUniClassByClassCode: host+"/test/api/uniclass/id/",

    /**PUT request */
    putMeeting: host+"/test/api/meeting",
    /**GET request, Need to append ***Meeting ID*** as path parameter */
    getMeetingByMeetingId: host+"/test/api/meeting/id/",
    /**GET request, Need to append ***Peer ID*** as path parameter */
    getMeetingByPeerId: host+"/test/api/meeting/peer/id/",
    /**GET request, Need to append ***Tutor ID*** as path parameter */
    getMeetingByTutorId: host+"/test/api/meeting/tutor/id/",
    /**GET request, Need to append ***Student ID*** as path parameter */
    getMeetingByStudentId: host+"/test/api/meeting/student/id/",

    /**PUT request */
    putRating: host+"/test/api/rating",
    /**GET request, Need to append ***Student ID*** as path parameter */
    getRatingAvgByStudentId: host+"/test/api/rating/avg/",
    /**GET request, Need to append ***Student ID of Given*** as path parameter */
    getRatingsByGivenStudentId: host+"/test/api/rating/given/",
    /**GET request, Need to append ***Rating ID*** as path parameter */
    getRatingByRatingId: host+"/test/api/rating/id/",
    /**GET request, Need to append ***Student ID of Received*** as path parameter */
    getRatingsByReceivedStudentId: host+"/test/api/rating/received/",
  }
};

/*
Note to self:
To run Docker on Windows 7:
download Docker toolbox etc.
run Docker terminal
run commands
change setting: 
  VirtualBox -> 
  docker machine -> 
  setting -> 
  network -> 
  adapter with NAT mode -> 
  port forwarding -> 
  map 5000 to 5000 w/ host 127.0.0.1 and local IP address

Configure firewall to allow port 5000 inbound traffic

 */

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
