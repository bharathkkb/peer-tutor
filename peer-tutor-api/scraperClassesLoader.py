from pymongo import MongoClient
import pprint
import json
import sys


def seedUniClasses():
    pp = pprint.PrettyPrinter(indent=4)
    client = MongoClient('0.0.0.0:27017')
    dblist = client.list_database_names()
    # if "peer-tutor-db" in dblist:
    #     print("The database exists. dropping")
    #     client.drop_database("peer-tutor-db")

    # sys.exit(0)

    mydb = client["peer-tutor-db"]
    collist = mydb.list_collection_names()
    if "uni_class" in collist:
        print("The collection exists.")
    uniClassCol = mydb["uni_class"]

    with open("../sjsu-scraper/data-allsections.json", "r") as read_file:
        data = json.load(read_file)
        # pp.pprint(data)

    print("Starting to seed university classes")
    for deptName, deptDict in data.items():
        deptId = deptDict["dept-id"]
        # pp.pprint(deptDict["classes"].items())
        for uni_className, uni_class in deptDict["classes"].items():
            # pp.pprint(uni_class)

            uniClass = dict()
            uniClass["dept-name"] = deptName
            uniClass["dept-id"] = deptId
            uniClass["class-name"] = uni_class["class-name"]
            uniClass["class-name-nospace"] = uni_class["class-name"].replace(
                ' ', '')
            uniClass["class-code"] = uni_class["code"]
            uniClass["dates"] = uni_class["dates"]
            uniClass["days"] = uni_class["days"]
            uniClass["instructor"] = uni_class["instructor"]
            uniClass["location"] = uni_class["location"]
            uniClass["time"] = uni_class["time"]
            uniClass["title"] = uni_class["title"]
            uniClass["units"] = uni_class["units"]
            uniClass["section"] = uni_class["section"]
            insertUniClass = uniClassCol.insert_one(uniClass)
            # pp.pprint("{} was inserted".format(uniClass["class-name"]))
    print("Finished seeding university classes")

    # cursor = uniClassCol.find({})
    # for uniClass in cursor:
    #     pp.pprint(uniClass)
    # print("Testing CS 160 classes")
    # for csclass in uniClassCol.find({"class-name": "CS 160"}):
    #     pp.pprint(csclass)


if __name__ == "__main__":
    seedUniClasses()
