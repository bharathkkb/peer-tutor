import json
from mongoDriver import mongoDriver
from bson import json_util, ObjectId
from meeting import Meeting
from timeBlock import TimeBlock


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

# returns one meeting with that meeting_id


def getMeetingById(meetingID):
    query = dict()
    query["meeting_id"] = meetingID
    return json.loads(json_util.dumps(mongoDriver().getFindOne("peer-tutor-db", "meetings", query)))


def getMeetingByIdWrapperResponse(meetingID):
    data = getMeetingById(meetingID)
    if(data):
        return data, 200
    else:
        return json.loads(json.dumps({"found": False})), 404

# returns a list of meetings with peer name matches with the given string
# loosely matches for example "lif" would return lifeng


def getMeetingsByPeer(peerID):
    query = dict()
    query["peer_id"] = peerID
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "meetings", query)))


# returns a list of meetings with tutor name matches with the given string

def getMeetingsByTutor(tutorID):
    query = dict()
    query["tutor_id"] = tutorID
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "meetings", query)))

# inserts new meeting
# if a meeting with the given meeting_id is found then the data is updated


def putMeeting(meetingData):
    # check if old meeting exists in db
    if getMeetingById(meetingData["meeting_id"]):
        updateMeeting = getMeetingById(meetingData["meeting_id"])
        # make new meeting with the same meeting id
        if(meetingData["peer_id"] == meetingData["tutor_id"]):
            meetingData["selfReserved"] = True
        else:
            meetingData["selfReserved"] = False

        if(not (meetingData.get("start", False) and meetingData.get("end", False))):
            return json.loads(json.dumps({"error": "Either start or end is not defined"})), 400

        timeB = TimeBlock(meetingData["start"], meetingData["end"])
        newMeetingData = Meeting(
            updateMeeting["meeting_id"], meetingData["peer_id"], meetingData["tutor_id"], time=timeB)
        # update the meeting info in db
        mongoDriver().updateDict("peer-tutor-db", "meetings",
                                 updateMeeting, newMeetingData.get_json())
        # return the latest meeting and 200 status code
        return getMeetingById(meetingData["meeting_id"]), 200
    else:
        # make a new meeting
        if(meetingData["peer_id"] == meetingData["tutor_id"]):
            meetingData["selfReserved"] = True
        else:
            meetingData["selfReserved"] = False

        if(not (meetingData.get("start", False) and meetingData.get("end", False))):
            return json.loads(json.dumps({"error": "Either start or end is not defined"})), 400
        timeB = TimeBlock(meetingData["start"], meetingData["end"])

        m = Meeting(meetingData["meeting_id"],
                    meetingData["peer_id"], meetingData["tutor_id"], time=timeB)

        # add meeting to the peer student object

        from student_driver import getStudentById, putStudent
        peer = getStudentById(
            meetingData["peer_id"], unfurlMeetings=False, unfurlUniClass=False)
        print(meetingData["peer_id"])
        peer["meetings"].append(meetingData["meeting_id"])
        putStudent(peer)

        # add meeting to the tutor student object
        tutor = getStudentById(
            meetingData["tutor_id"], unfurlMeetings=False, unfurlUniClass=False)
        tutor["meetings"].append(meetingData["meeting_id"])
        putStudent(tutor)

        # add the new meeting to db
        mongoDriver().putDict("peer-tutor-db", "meetings", m.get_json())
        # return new meeting obj with 201 status code
        return getMeetingById(meetingData["meeting_id"]), 201


def getAllMeeting(studentID):
    fullMeeting = getMeetingsByPeer(studentID) + getMeetingsByTutor(studentID)
    fullMeetingList = list({v['meeting_id']: v for v in fullMeeting}.values())
    return fullMeetingList


# just for testing purpose
if __name__ == "__main__":
    m = dict()
    m["meeting_id"] = "06"
    m["peer_id"] = "00011"
    m["tutor_id"] = "10001"
    print(putMeeting(m))
