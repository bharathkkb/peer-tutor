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
  }
};
