//TODO: change to proper host on production
const host = 'http://localhost:5000';

export const environment = {
  production: true,
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
