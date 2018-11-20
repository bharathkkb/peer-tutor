import json
from mongoDriver import mongoDriver

from bson import json_util, ObjectId
from student import Student
from student_driver import putStudent, getStudentById


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def login(loginData):
    username = loginData["username"]
    password = loginData["password"]
    findStudent = dict()
    findStudent["username"] = username
    findStudent["password"] = password

    found = json.loads(json_util.dumps(mongoDriver().getFindOne(
        "peer-tutor-db", "student", findStudent)))
    if found:
        student = getStudentById(found["student_id"])
        return student, 200
    else:
        return json.loads(json.dumps({"authorization": False})), 404


def register(registerData):
    username = registerData["username"]
    password = registerData["password"]
    name = registerData["name"]
    studentID = registerData["student_id"]
    findStudent = dict()
    findStudent["student_id"] = registerData["student_id"]
    found = mongoDriver().getFindOne("peer-tutor-db", "student", findStudent)
    if found:
        return json.loads(json.dumps({"accountExists": True})), 403
    else:
        return putStudent(registerData)


# just for testing purpose
if __name__ == "__main__":
    s = dict()
    s["username"] = "studentnew@gmail.com"
    s["password"] = "studentnew123"
    s["name"] = "studentnew"
    s["student_id"] = "09"
    print(register(s))
