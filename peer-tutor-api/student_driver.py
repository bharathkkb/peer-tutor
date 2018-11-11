import json
from mongoDriver import mongoDriver

from bson import json_util, ObjectId


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def getStudent(studentID):
    return json.loads(json_util.dumps(mongoDriver().getFindOne("peer-tutor-db", "student", False)))
