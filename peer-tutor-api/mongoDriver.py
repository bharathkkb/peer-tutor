from pymongo import MongoClient
import sys
from pymongo.errors import ConnectionFailure


class mongoDriver():
    def connectToMongo(self):
        """ Connect to MongoDB """
        try:
            client = MongoClient('mongodb:27017')
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
                return collection.find_one()
        except ConnectionFailure as e:
            sys.stderr.write(
                "Could not fetch one from MongoDB: {}".format(str(e)))
            sys.exit(1)


# just for testing queries
if __name__ == "__main__":
    print(mongoDriver().getFindOne("peer-tutor-db", "student", False))
