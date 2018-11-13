import json
from mongoDriver import mongoDriver

from bson import json_util, ObjectId
from student import Student


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

# returns one student with that id


def getStudentById(studentID):
    query = dict()
    query["student_id"] = studentID
    return json.loads(json_util.dumps(mongoDriver().getFindOne("peer-tutor-db", "student", query)))

# returns a list of students whose name matches with the given string
# loosely matches for example "lif" would return lifeng


def getStudentsByName(studentName):
    query = dict()
    query["name"] = dict()
    query["name"]["$regex"] = studentName
    # to make it case insensitive
    query["name"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "student", query)))

# inserts new student
# if a student with the given id is found then the data is updated


def putStudent(studentData):

    # check if old student exists in db
    if getStudentById(studentData["student_id"]):
        updateStudent = getStudentById(studentData["student_id"])
        # make new student with the same student id
        newStudentData = Student(
            updateStudent["student_id"], studentData["name"], studentData["username"], studentData["password"])
        # update the student info in db
        mongoDriver().updateDict("peer-tutor-db", "student",
                                 updateStudent, newStudentData.get_json())
        # return the latest student and 200 status code
        return getStudentById(studentData["student_id"]), 200
    else:
        # make a new student
        s = Student(studentData["student_id"], studentData["name"],
                    studentData["username"], studentData["password"])

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
