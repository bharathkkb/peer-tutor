from pymongo import MongoClient
client = MongoClient('0.0.0.0:27017')
dblist = client.list_database_names()
if "peer-tutor-db" in dblist:
    print("The database exists. Dropping it now")
    client.drop_database("peer-tutor-db")
print("Starting Seeding")
mydb = client["peer-tutor-db"]
studentCol = mydb["student"]
student1 = {"name": "Lifeng", "student_id": "02"}
student2 = {"name": "Albert", "student_id": "04"}
studentCol.insert_one(student1)
studentCol.insert_one(student2)
print("inserted")
