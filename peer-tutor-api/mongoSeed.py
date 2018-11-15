from pymongo import MongoClient
client = MongoClient('0.0.0.0:27017')
dblist = client.list_database_names()
if "peer-tutor-db" in dblist:
    print("The database exists. Dropping it now")
    client.drop_database("peer-tutor-db")
print("Starting Seeding")
mydb = client["peer-tutor-db"]


studentCol = mydb["student"]
student1 = {"name": "Lifeng", "student_id": "02",
            "username": "lifeng@gmail.com", "password": "pass123"}
student2 = {"name": "Albert", "student_id": "04",
            "username": "albert@gmail.com", "password": "pass123"}
student3 = {"name": "Sheldon", "student_id": "06",
            "username": "sheldon@gmail.com", "password": "sheldon123"}
studentCol.insert_one(student1)	studentCol.insert_one(student1)
studentCol.insert_one(student2)	studentCol.insert_one(student2)
studentCol.insert_one(student3)

meetingCol = mydb["meeting"]
meeting1 = {"meeting_id": "06", "peer_id": "00011", "tutor_id": "10001"}
meeting2 = {"meeting_id": "02", "peer_id": "00011", "tutor_id": "10002", }
meetingCol.insert_one(meeting1)
meetingCol.insert_one(meeting2)




print("inserted")
