import json
from mongoDriver import mongoDriver
import pprint
from bson import json_util, ObjectId
from student import Student
import copy
exclude = dict()
exclude["class-name-nospace"] = 0


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


# given a student with class id in enrolled classes this unfurls it into a full uni class
def unfurl_enrolled_classes(dbClass):
    from student_driver import getStudentById
    if(dbClass and dbClass.get("students", False)):
        unfurl_students = list()
        for student in dbClass["students"]:
            try:
                uniclass = getStudentById(
                    str(student), unfurlMeetings=False, unfurlUniClass=False)
                unfurl_students.append(uniclass)
            except Exception as ex:
                print("Error retriving a student {}".format(student))
                continue
        dbClass["students"] = unfurl_students
    return dbClass

# returns one class with that id


def getClassById(classId, unfurlClass=True):
    query = dict()
    query["class-code"] = classId
    uniclass = json.loads(json_util.dumps(mongoDriver().getFindOne(
        "peer-tutor-db", "uni_class", query, exclude)))
    if(unfurlClass):
        uniclass = unfurl_enrolled_classes(uniclass)
    return uniclass


def getClassByIdWrapperResponse(classId):
    data = getClassById(classId)
    if(data):
        return data, 200
    else:
        return json.loads(json.dumps({"found": False})), 404
# returns a list of all dept and their ids


def getDepartments():
    all = mongoDriver().getFind("peer-tutor-db", "uni_class")
    deptList = list()
    for dept in all:
        deptData = dict()
        deptData["dept-id"] = dept["dept-id"]
        deptData["dept-name"] = dept["dept-name"]
        deptList.append(deptData)
    fullDeptList = list({v['dept-id']: v for v in deptList}.values())
    return json.loads(json_util.dumps(fullDeptList))

# returns a list of classes whose name matches with the given string
# loosely matches for example "CS16" would return CS160, CS166 and CS161 etc all classes all sections


def putStudentInClass(studentID, classId):
    from student_driver import getStudentById
    uniclass = getClassById(classId)
    student = getStudentById(studentID)
    if(uniclass.get("students", False)):

        if(studentID not in uniclass["students"]):
            uniclass["students"].append(studentID)
    else:
        uniclass["students"] = list()
        uniclass["students"].append(studentID)
    updateClass(uniclass)


def updateClass(UniClassData):
    UniclassWoutKey = copy.deepcopy(UniClassData)
    UniclassWoutKey.pop("_id", None)
    try:
        mongoDriver().updateDict("peer-tutor-db", "uni_class", UniClassData, UniclassWoutKey)
        return True
    except Exception as ex:
        return False


def getClassByName(className):
    query1 = dict()
    query1["class-name"] = dict()
    query1["class-name"]["$regex"] = className
    # to make it case insensitive
    query1["class-name"]["$options"] = 'i'
    query2 = dict()
    query2["class-name-nospace"] = dict()
    query2["class-name-nospace"]["$regex"] = className
    # to make it case insensitive
    query2["class-name-nospace"]["$options"] = 'i'
    q1 = mongoDriver().getFind("peer-tutor-db", "uni_class", query1, exclude)
    q2 = mongoDriver().getFind("peer-tutor-db", "uni_class", query2, exclude)
    fullData = json.loads(json_util.dumps(q1)) + \
        json.loads(json_util.dumps(q2))
    fullDataList = list({v['class-code']: v for v in fullData}.values())
    return fullDataList

# returns a list of classes whose title matches with the given string


def getClassByTitle(classTitle):
    query = dict()
    query["title"] = dict()
    query["title"]["$regex"] = classTitle
    # to make it case insensitive
    query["title"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query, exclude)))

# returns a list of classes whose instructorName matches with the given string


def getClassByInstructor(instructorName):
    query = dict()
    query["instructor"] = dict()
    query["instructor"]["$regex"] = instructorName
    # to make it case insensitive
    query["instructor"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query, exclude)))

# returns a list of classes whose deptName matches with the given string


def getClassByDept(deptName):
    query = dict()
    query["dept-name"] = dict()
    query["dept-name"]["$regex"] = deptName
    # to make it case insensitive
    query["dept-name"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query, exclude)))

# returns a list of classes whose deptId matches with the given Id


def getClassByDeptId(deptId):
    query = dict()
    query["dept-id"] = deptId
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query, exclude)))


# just for testing purpose
if __name__ == "__main__":
    # s = dict()
    # s["instructor"] = "Cao"
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(getClassByTitle("Software"))
