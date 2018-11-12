from pymongo import MongoClient
import sys
from pymongo.errors import ConnectionFailure
from bson import json_util, ObjectId


class mongoDriver():
    def connectToMongo(self):
        """ Connect to MongoDB """
        try:
            # client = MongoClient('mongodb:27017')
            client = MongoClient('localhost:27017')
            print("Connected successfully")
            return client
        except ConnectionFailure as e:
            sys.stderr.write("Could not connect to MongoDB:{}".format(str(e)))
            sys.exit(1)

    def getFind(self, dbName, collectionName, query=False):
        """ Run a query to get data from Mongo DB """
        conn = self.connectToMongo()
        try:
            db = conn[dbName]
            collection = db[collectionName]
            if query:
                return collection.find(query)
            else:
                return collection.find()
        except ConnectionFailure as e:
            sys.stderr.write("Could not fetch from MongoDB: {}".format(str(e)))
            sys.exit(1)

    def getFindOne(self, dbName, collectionName, query=False):
        """ Run a query to get data from Mongo DB """
        conn = self.connectToMongo()
        try:
            db = conn[dbName]
            collection = db[collectionName]
            if query:
                return collection.find_one(query)
            else:
                print("in here")
                return collection.find_one()
        except ConnectionFailure as e:
            sys.stderr.write(
                "Could not fetch one from MongoDB: {}".format(str(e)))
            sys.exit(1)

    def putDict(self, dbName, collectionName, obj):
        """ Run a query to put data into Mongo DB """
        conn = self.connectToMongo()
        try:
            db = conn[dbName]
            collection = db[collectionName]

            return collection.insert(obj)

        except ConnectionFailure as e:
            sys.stderr.write(
                "Could not write one to MongoDB: {}".format(str(e)))
            sys.exit(1)

    def updateDict(self, dbName, collectionName, oldObj, newObj):
        """ Run a query to update data into Mongo DB """
        conn = self.connectToMongo()
        try:
            db = conn[dbName]
            collection = db[collectionName]
            for key, val in newObj.items():
                try:
                    collection.update_one({'_id': ObjectId(oldObj['_id']['$oid'])}, {
                                          '$set': {key: val}}, upsert=False)
                except Exception as ex:
                    sys.stderr.write(
                        "Error while updating: {}".format(str(ex)))
            return True

        except ConnectionFailure as e:
            sys.stderr.write(
                "Could not update one to MongoDB: {}".format(str(e)))
            sys.exit(1)



# just for testing queries
if __name__ == "__main__":
    query = dict()
    query["student_id"] = "02"
    # query = {'student_id': '02'}
    print(mongoDriver().getFindOne("peer-tutor-db", "student", query))
