const host = 'http://firen777-networklab.ddns.net:5000';

export const apipath = {
    register: { path: host+"/test/api/register", method: "POST" },
    login: { path: host+"/test/api/login", method: "POST" },
    putStudent: { path: host+"/test/api/student", method: "PUT" },
    /**Need to append Student ID as path parameter */
    getStudentById: { path: host+"/test/api/student/id/", method: "GET" },
    /**Need to append Student Name as path parameter */
    getStudentsByName: { path: host+"/test/api/student/name/", method: "GET" },
};