from pymongo import MongoClient
client = MongoClient('localhost:27017')
dblist = client.list_database_names()
if "peer-tutor-db" in dblist:
    print("The database exists. Dropping it now")
    client.drop_database("peer-tutor-db")
print("Starting Seeding")
mydb = client["peer-tutor-db"]
studentCol = mydb["student"]
student1 = {"student_name": "Lifeng", "student_id": "02"}
insertId = studentCol.insert_one(student1)
print(insertId)
