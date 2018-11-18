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
        print("Dropping database to start fresh")
        client.drop_database("peer-tutor-db")
    print("Starting to seed students and meetings")
    mydb = client["peer-tutor-db"]
    studentCol = mydb["student"]
    student1 = {"name": "Lifeng", "student_id": "02",
                "username": "lifeng@gmail.com", "password": "pass123", "enrolled_classes": [24778, 30053, 29567]}
    student2 = {"name": "Albert", "student_id": "04",
                "username": "albert@gmail.com", "password": "pass123", "enrolled_classes": [28583, 22052, 30143]}
    student3 = {"name": "Sheldon", "student_id": "06",
                "username": "sheldon@gmail.com", "password": "sheldon123", "enrolled_classes": [28020, 27382, 22674]}
    studentCol.insert_one(student1)
    studentCol.insert_one(student2)
    studentCol.insert_one(student3)

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
    print("Finished seeding students and meetings")


if __name__ == "__main__":
    seedUsersMeetings()
