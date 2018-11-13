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
# loosely matches for example "CS16" would return CS160, CS166 and CS161 etc all classes all sections


def getClassByName(className):
    query = dict()
    query["class-name"] = dict()
    query["class-name"]["$regex"] = className
    # to make it case insensitive
    query["class-name"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query)))

# returns a list of classes whose title matches with the given string


def getClassByTitle(classTitle):
    query = dict()
    query["title"] = dict()
    query["title"]["$regex"] = classTitle
    # to make it case insensitive
    query["title"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query)))

# returns a list of classes whose instructorName matches with the given string


def getClassByInstructor(instructorName):
    query = dict()
    query["instructor"] = dict()
    query["instructor"]["$regex"] = instructorName
    # to make it case insensitive
    query["instructor"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query)))

# returns a list of classes whose deptName matches with the given string


def getClassByDept(deptName):
    query = dict()
    query["dept-name"] = dict()
    query["dept-name"]["$regex"] = deptName
    # to make it case insensitive
    query["dept-name"]["$options"] = 'i'
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "uni_class", query)))


# just for testing purpose
if __name__ == "__main__":
    # s = dict()
    # s["instructor"] = "Cao"
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(getClassByTitle("Software"))