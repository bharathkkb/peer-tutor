import json
from mongoDriver import mongoDriver
from bson import json_util, ObjectId
from rating import Rating


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


# returns one student with that id


def getRatingById(ratingID):
    query = dict()
    query["rating_id"] = ratingID
    dbRating = mongoDriver().getFindOne("peer-tutor-db", "ratings", query)
    return json.loads(json_util.dumps(dbRating))


def getRatingByIdWrapperResponse(ratingID):
    data = getRatingById(ratingID)
    if(data):
        return data, 200
    else:
        return json.loads(json.dumps({"found": False})), 404


def getRatingsByGivenStudentId(givenStudentId):
    query = dict()
    query["given"] = givenStudentId
    allRatings = mongoDriver().getFind("peer-tutor-db", "ratings", query)
    return json.loads(json_util.dumps(allRatings))


def getRatingsByReceivedStudentId(recStudentId):
    query = dict()
    query["received"] = recStudentId
    allRatings = mongoDriver().getFind("peer-tutor-db", "ratings", query)
    return json.loads(json_util.dumps(allRatings))


def putRating(ratingData):
    if(not (ratingData.get("rating_id", False) and ratingData.get("received", False) and ratingData.get("given", False) and ratingData.get("rating_score", False))):
        return json.loads(json.dumps({"error": "All required fields are not defined"})), 400
    # check if old rating exists in db
    if getRatingById(ratingData["rating_id"]):
        updateRating = getRatingById(ratingData["rating_id"])
        if(updateRating["rating_id"] != ratingData["rating_id"]):
            return json.loads(json.dumps({"error": "rating id for the rating to update doesnt match"})), 400
        if(updateRating["received"] != ratingData["received"] or updateRating["given"] != ratingData["given"]):
            return json.loads(json.dumps({"error": "given or recieved ids for the rating to update doesnt match"})), 400
        # make new student with the same student id
        newRatingData = Rating(
            updateRating["rating_id"], updateRating["given"], updateRating["received"], ratingData["rating_score"], ratingData.get("comment", None))
        # update the student info in db
        mongoDriver().updateDict("peer-tutor-db", "ratings",
                                 updateRating, newRatingData.get_json())
        # return the latest rating and 200 status code
        return getRatingById(updateRating["rating_id"]), 200
    else:
        # make a new student
        r = Rating(ratingData["rating_id"], ratingData["given"], ratingData["received"],
                   ratingData["rating_score"], ratingData.get("comment", None))
        print(r.get_json())
        # add the new student to db
        mongoDriver().putDict("peer-tutor-db", "ratings", r.get_json())
        # return new student obj with 201 status code
        return getRatingById(ratingData["rating_id"]), 201


# just for testing purpose
if __name__ == "__main__":
    rating_dict = dict()
    rating_dict["rating_id"] = "02"
    rating_dict["given"] = "01"
    rating_dict["received"] = "02"
    rating_dict["rating_score"] = "1"
    rating_dict["comment"] = "lorem imposeom3"
    print(putRating(rating_dict))
