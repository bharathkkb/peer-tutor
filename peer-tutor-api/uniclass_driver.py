import json
from mongoDriver import mongoDriver
import pprint
from bson import json_util, ObjectId
from student import Student


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

# returns one class with that id


def getClassById(classId):
    query = dict()
    query["class-id"] = classId
    return json.loads(json_util.dumps(mongoDriver().getFindOne("peer-tutor-db", "uni_class", query)))

# returns a list of classes whose name matches with the given string
# loosely matches for example "CS16" would return CS160 and CS160 classes all sections


def getClassByName(className):
    query = dict()
    query["class-name"] = dict()
    query["class-name"]["$regex"] = className
    # to make it case insensitive
    query["class-name"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query)))


def getClassByTitle(classTitle):
    query = dict()
    query["class-title"] = dict()
    query["class-title"]["$regex"] = classTitle
    # to make it case insensitive
    query["class-title"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query)))


def getClassByInstructor(instructorName):
    query = dict()
    query["instructor"] = dict()
    query["instructor"]["$regex"] = instructorName
    # to make it case insensitive
    query["instructor"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query)))


def getClassByDept(deptName):
    query = dict()
    query["dept-name"] = dict()
    query["dept-name"]["$regex"] = deptName
    # to make it case insensitive
    query["dept-name"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query)))

# inserts new student
# if a student with the given id is found then the data is updated


# def putStudent(studentData):
#
#     # check if old student exists in db
#     if getStudentById(studentData["student_id"]):
#         updateStudent = getStudentById(studentData["student_id"])
#         # make new student with the same student id
#         newStudentData = Student(
#             updateStudent["student_id"], studentData["name"], studentData["username"], studentData["password"])
#         # update the student info in db
#         mongoDriver().updateDict("peer-tutor-db", "student",
#                                  updateStudent, newStudentData.get_json())
#         # return the latest student and 200 status code
#         return getStudentById(studentData["student_id"]), 200
#     else:
#         # make a new student
#         s = Student(studentData["student_id"], studentData["name"],
#                     studentData["username"], studentData["password"])
#
#         # add the new student to db
#         mongoDriver().putDict("peer-tutor-db", "student", s.get_json())
#         # return new student obj with 201 status code
#         return getStudentById(studentData["student_id"]), 201


# just for testing purpose
if __name__ == "__main__":
    # s = dict()
    # s["instructor"] = "Cao"
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(getClassByName("CS 16"))
