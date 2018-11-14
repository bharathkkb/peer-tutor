import json
from mongoDriver import mongoDriver

from bson import json_util, ObjectId
from meeting import Meeting


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

# returns one meeting with that meeting_id


def getMeetingById(meetingID):
    query = dict()
    query["meeting_id"] = meetingID
    return json.loads(json_util.dumps(mongoDriver().getFindOne("peer-tutor-db", "meeting", query)))

# returns a list of meetings with peer name matches with the given string
# loosely matches for example "lif" would return lifeng

def getMeetingsByPeer(peerID):
    query = dict()
    query["peer_id"] = peerID
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "meeting", query)))


# returns a list of meetings with tutor name matches with the given string

def getMeetingsByTutor(tutorID):
    query = dict()
    query["tutor"] = tutorID
    return json.loads(json_util.dumps(mongoDriver().getFind("peer-tutor-db", "meeting", query)))

# inserts new meeting
# if a meeting with the given meeting_id is found then the data is updated


def putMeeting(meetingData):
    # check if old meeting exists in db
    if getMeetingById(meetingData["meeting_id"]):
        updateMeeting = getMeetingById(meetingData["meeting_id"])
        # make new meeting with the same meeting id
        newMeetingData = Meeting(
            updateMeeting["meeting_id"], meetingData["peer_id"], meetingData["tutor_id"])
        # update the meeting info in db
        mongoDriver().updateDict("peer-tutor-db", "meeting",
                                 updateMeeting, newMeetingData.get_json())
        # return the latest meeting and 200 status code
        return getMeetingById(meetingData["meeting_id"]), 200
    else:
        # make a new meeting
        m = Meeting(meetingData["meeting_id"], meetingData["peer_id"], meetingData["tutor_id"])
        # add the new meeting to db
        mongoDriver().putDict("peer-tutor-db", "meeting", m.get_json())
        # return new meeting obj with 201 status code
        return getMeetingById(meetingData["meeting_id"]), 201

def getAllMeeting(studentID):
    return getMeetingsByPeer(studentID).append(getMeetingsByTutor(studentID))

# just for testing purpose
if __name__ == "__main__":
    m = dict()
    m["meeting_id"] = "06"
    m["peer_id"] = "00011"
    m["tutor_id"] = "10001"
    print(putMeeting(m))
