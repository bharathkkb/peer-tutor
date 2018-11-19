from pymongo import MongoClient
import os


def seedUsersMeetings():
    SECRET_KEY = os.environ.get('AM_I_IN_A_DOCKER_CONTAINER', False)
    if SECRET_KEY:
        client = MongoClient('mongodb:27017')
    else:
        client = MongoClient('localhost:27017')
    dblist = client.list_database_names()
    if "peer-tutor-db" in dblist:
        print(" Dropping database to start fresh")
        client.drop_database("peer-tutor-db")
    print("Starting to seed students and meetings")
    mydb = client["peer-tutor-db"]
    studentCol = mydb["student"]
    student1 = {"name": "Lifeng", "student_id": "02",
                "username": "lifeng@gmail.com", "password": "pass123", "enrolled_classes": [24778, 30053, 29567], "meetings": [11, 13]}
    student2 = {"name": "Albert", "student_id": "04",
                "username": "albert@gmail.com", "password": "pass123", "enrolled_classes": [28583, 22052, 30143], "meetings": [12]}
    student3 = {"name": "Sheldon", "student_id": "06",
                "username": "sheldon@gmail.com", "password": "sheldon123", "enrolled_classes": [28020, 27382, 22674], "meetings": []}
    student4 = {"name": "TestStudent1", "student_id": "00011",
                "username": "TestStudent1@gmail.com", "password": "test12", "enrolled_classes": [], "meetings": []}
    student5 = {"name": "TestStudent2", "student_id": "00012",
                "username": "TestStudent2@gmail.com", "password": "34test", "enrolled_classes": [], "meetings": []}
    student6 = {"name": "TestStudent3", "student_id": "10002",
                "username": "TestStudent3@gmail.com", "password": "blah1", "enrolled_classes": [], "meetings": []}
    student7 = {"name": "TestStudent4", "student_id": "00011",
                "username": "TestStudent4@gmail.com", "password": "blah2", "enrolled_classes": [], "meetings": []}
    student8 = {"name": "TestStudent5", "student_id": "10003",
                "username": "TestStudent5@gmail.com", "password": "blah3", "enrolled_classes": [], "meetings": []}
    studentCol.insert_one(student1)
    studentCol.insert_one(student2)
    studentCol.insert_one(student3)
    studentCol.insert_one(student4)
    studentCol.insert_one(student5)
    studentCol.insert_one(student6)
    studentCol.insert_one(student7)
    studentCol.insert_one(student8)

    meetingCol = mydb["meetings"]
    # meeting1 = {"name": "meeting1", "meeting_id": "02"}
    meeting1 = {"meeting_id": "01", "peer_id": "00012", "tutor_id": "10002"}
    meetingCol.insert_one(meeting1)
    meeting2 = {"meeting_id": "06", "peer_id": "00011", "tutor_id": "10001"}
    meeting3 = {"meeting_id": "02", "peer_id": "00011", "tutor_id": "10002"}
    meeting4 = {"meeting_id": "05", "peer_id": "00012", "tutor_id": "00011"}
    meetingCol.insert_one(meeting2)
    meetingCol.insert_one(meeting3)
    meetingCol.insert_one(meeting4)

    meeting5 = {"meeting_id": "11", "peer_id": "02",
                "tutor_id": "04", "selfReserved": False}
    meeting6 = {"meeting_id": "12", "peer_id": "04",
                "tutor_id": "06", "selfReserved": False}
    meeting7 = {"meeting_id": "13", "peer_id": "02",
                "tutor_id": "02", "selfReserved": True}
    meetingCol.insert_one(meeting5)
    meetingCol.insert_one(meeting6)
    meetingCol.insert_one(meeting7)
    print("Finished seeding students and meetings")


if __name__ == "__main__":
    seedUsersMeetings()
