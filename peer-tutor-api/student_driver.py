import json
from mongoDriver import mongoDriver
from bson import json_util, ObjectId
from student import Student
from meeting_driver import getMeetingById
from uniclass_driver import getClassById, putStudentInClass


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


# given a student with class id in enrolled classes this unfurls it into a full uni class
def unfurl_enrolled_classes(dbStudent):
    if(dbStudent and dbStudent.get("enrolled_classes", False)):
        unfurl_enrolled_classes = list()
        for enrolled_class in dbStudent["enrolled_classes"]:
            try:
                uniclass = getClassById(str(enrolled_class))
                unfurl_enrolled_classes.append(uniclass)
            except Exception as ex:
                print("Error retriving a class {}".format(enrolled_class))
                continue
        dbStudent["enrolled_classes"] = unfurl_enrolled_classes
    return dbStudent


def unfurl_meetings(dbStudent):
    if(dbStudent and dbStudent.get("meetings", False)):
        unfurl_meetings = list()
        for meeting in dbStudent["meetings"]:
            try:
                meetingData = getMeetingById(str(meeting))
                unfurl_meetings.append(meetingData)
            except Exception as ex:
                print("Error retriving a meeting {}".format(enrolled_class))
                continue
        dbStudent["meetings"] = unfurl_meetings
    return dbStudent

# returns one student with that id


def getStudentById(studentID, unfurlMeetings=True, unfurlUniClass=True):
    query = dict()
    query["student_id"] = studentID
    dbStudent = mongoDriver().getFindOne("peer-tutor-db", "student", query)
    # unfurl each class object and discard old ids
    if unfurlUniClass:
        dbStudent = unfurl_enrolled_classes(dbStudent)
    if unfurlMeetings:
        dbStudent = unfurl_meetings(dbStudent)
    return json.loads(json_util.dumps(dbStudent))


def getStudentByIdWrapperResponse(studentID):
    data = getStudentById(studentID)
    if(data):
        return data, 200
    else:
        return json.loads(json.dumps({"found": False})), 404

# returns a list of students whose name matches with the given string
# loosely matches for example "lif" would return lifeng


def getStudentsByName(studentName):
    query = dict()
    query["name"] = dict()
    query["name"]["$regex"] = studentName
    # to make it case insensitive
    query["name"]["$options"] = 'i'
    allStudents = mongoDriver().getFind("peer-tutor-db", "student", query)
    unfurled_students = list()
    for student in allStudents:
        unfurled_students.append(unfurl_enrolled_classes(student))
    return json.loads(json_util.dumps(unfurled_students))


def updateUniClassStudentData(studentData):
    for uniclass in studentData["enrolled_classes"]:
        putStudentInClass(studentData["student_id"], uniclass)


# inserts new student
# if a student with the given id is found then the data is updated


def putStudent(studentData):
    keys = studentData.keys()
    requiredkeys = ["student_id", "username", "name",
                    "password", "security_question", "security_answer"]
    for key in requiredkeys:
        if key not in keys:
            return json.loads(json.dumps({"error": "{} is a required field".format(key)})), 400

    # check if old student exists in db
    if getStudentById(studentData["student_id"]):
        updateStudent = getStudentById(studentData["student_id"])
        if(updateStudent["student_id"] != studentData["student_id"]):
            return json.loads(json.dumps({"error": "student id for the student to update doesnt match"})), 400
        if(studentData.get("enrolled_classes", False) and len(studentData["enrolled_classes"]) > 0):
            updateUniClassStudentData(studentData)
        # make new student with the same student id
        newStudentData = Student(
            updateStudent["student_id"], studentData["name"], studentData["username"], studentData["password"], studentData["security_question"], studentData["security_answer"], studentData.get("enrolled_classes", list()), studentData.get("meetings", list()))
        # update the student info in db
        mongoDriver().updateDict("peer-tutor-db", "student",
                                 updateStudent, newStudentData.get_json())
        # return the latest student and 200 status code
        return getStudentById(studentData["student_id"]), 200
    else:
        # make a new student
        s = Student(studentData["student_id"], studentData["name"],
                    studentData["username"], studentData["password"], studentData["security_question"], studentData["security_answer"], studentData.get("enrolled_classes", list()), studentData.get("meetings", list()))
        print(s.get_json())
        if(studentData.get("enrolled_classes", False) and len(studentData["enrolled_classes"]) > 0):
            updateUniClassStudentData(studentData)
        # add the new student to db
        mongoDriver().putDict("peer-tutor-db", "student", s.get_json())
        # return new student obj with 201 status code
        return getStudentById(studentData["student_id"]), 201


# just for testing purpose
if __name__ == "__main__":
    s = dict()
    s["student_id"] = "06"
    s["name"] = "Bharath2"
    print(putStudent(s))
