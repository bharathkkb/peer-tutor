
from swagger_spec_validator import validate_spec_url
import flex
import requests
from flex.core import load, validate_api_call
import pprint
import pytest
import json
import sys
import os
from mongoSeed import seedUsersMeetings
from scraperClassesLoader import seedUniClasses
from server import createApp, createAppThread
import time
import threading
from requests.exceptions import ConnectionError
"""
**************************************
Setup
**************************************
"""
seedUsersMeetings()
seedUniClasses()

# make an app thread


def appThread():
    app = createAppThread()
    app.run(host='0.0.0.0', port=5000, debug=False)


def test_start_daemon_api_thread(local):
    print(local)
    if(local == "0"):
        print("Starting daemon serve thread")
        apiThread = threading.Thread(name='Web App', target=appThread)
        apiThread.setDaemon(True)
        apiThread.start()
        while not apiThread.is_alive():
            pass
    else:
        print(
            "Not starting daemon serve thread, assuming server running in a seperate process")


def test_thread(url):
    maxTry = 200
    currentTry = 0
    while currentTry < maxTry:
        currentTry += 1
        try:
            testAPIBasePath = "{}/test/api".format(url)
            response = requests.get(testAPIBasePath + '/hello', timeout=300)
            if(response.status_code == 200):
                break
        except ConnectionError as ex:
            pass


"""
**************************************
Swagger Infra Tests
**************************************
"""


def validateSwagger(url):
    testAPIBasePath = "{}/test/api".format(url)
    validate_spec_url(testAPIBasePath + '/swagger.json')


# check connection to server


def test_case_connection(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/hello', timeout=300)
    assert response.status_code == 200

# pytest for validating swagger schema


def test_validateSwagger(url):
    assert validateSwagger(url) == None

# helper for validate hello schema


def hello_schema(url, schema):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/hello')
    validate_api_call(schema, raw_request=response.request,
                      raw_response=response)

# pytest for validating hello schema


def test_hello_schema(url):
    testAPIBasePath = "{}/test/api".format(url)
    schema = flex.load(testAPIBasePath + '/swagger.json')
    assert hello_schema(url, schema) == None

# pytest for validating data returned by /hello endpoint


def test_hello_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/hello')
    data = json.loads(response.content)
    assert data["hello"] == "hello"


"""
**************************************
Student Driver Tests
**************************************
"""

# testing get student endpoint

# check get student by id


def test_get_student_by_id_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/student/id/02')
    data = json.loads(response.content)
    assert response.status_code == 200
    assert data["student_id"] == "02"
    assert data["name"] == "Lifeng"
    assert data["security_answer"] == "doggy"
    assert data["security_question"] == "Whats my pets name?"
    assert len(data["enrolled_classes"]) == 3
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]) in ["24778", "30053", "29567"]
    for meeting in data["meetings"]:
        assert str(meeting["meeting_id"]) in ["11", "13"]

# check get student by wrong id


def test_get_student_by_id_data_fail(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/student/id/9999')
    data = json.loads(response.content)
    assert response.status_code == 404
    assert data["found"] == False


# check get student by name
def test_get_student_by_name_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/student/name/lif')
    data = json.loads(response.content)
    # since return is a list use data[0]
    assert response.status_code == 200
    assert data[0]["student_id"] == "02"
    assert data[0]["name"] == "Lifeng"

# check adding student with pre defined classes


def test_put_student_data(url):
    putStudent = dict()
    putStudent["name"] = "BharathUpdate"
    putStudent["student_id"] = "07"
    putStudent["username"] = "bharathupdate@gmail.com"
    putStudent["password"] = "pass123"
    putStudent["security_question"] = "new question"
    putStudent["security_answer"] = "new answer"
    putStudent["enrolled_classes"] = [
        "22271", "28363", "22363", "21299"]
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/student', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 201
    data = json.loads(putResponse.content)
    # test if insert was success

    assert data["student_id"] == putStudent["student_id"]
    assert data["name"] == putStudent["name"]
    assert data["password"] == putStudent["password"]
    assert data["username"] == putStudent["username"]
    assert data["security_question"] == putStudent["security_question"]
    assert data["security_answer"] == putStudent["security_answer"]
    assert len(data["enrolled_classes"]) == 4
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudent["enrolled_classes"]


def test_put_student_data_fail_no_name(url):
    putStudent = dict()
    putStudent["student_id"] = "13407"
    putStudent["username"] = "bharathupdate@gmail.com"
    putStudent["password"] = "pass123"
    putStudent["security_question"] = "new question"
    putStudent["security_answer"] = "new answer"
    putStudent["enrolled_classes"] = [
        "22271", "28363", "22363", "21299"]
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/student', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 400


def test_put_student_data_fail_no_security(url):
    putStudent = dict()
    putStudent["name"] = "BharathUpdate"
    putStudent["student_id"] = "1307"
    putStudent["username"] = "bharathupdate@gmail.com"
    putStudent["password"] = "pass123"
    putStudent["enrolled_classes"] = [
        "22271", "28363", "22363", "21299"]
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/student', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 400

# check modifying the student added above


def test_modify_student_data(url):
    putStudent = dict()
    putStudent["name"] = "Bharath"
    putStudent["student_id"] = "07"
    putStudent["username"] = "bharathupdate2@gmail.com"
    putStudent["password"] = "pass12345"
    putStudent["enrolled_classes"] = ["22271"]
    putStudent["security_question"] = "new updated question"
    putStudent["security_answer"] = "new updated answer"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/student', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 200
    data = json.loads(putResponse.content)
    # test if insert was success

    assert data["student_id"] == putStudent["student_id"]
    assert data["name"] == putStudent["name"]
    assert data["password"] == putStudent["password"]
    assert data["username"] == putStudent["username"]
    assert data["security_question"] == putStudent["security_question"]
    assert data["security_answer"] == putStudent["security_answer"]
    assert len(data["enrolled_classes"]) == 1
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudent["enrolled_classes"]


"""
**************************************
University Class Driver Tests
**************************************
"""
putStudent = dict()
putStudent["name"] = "StudentUniClass"
putStudent["student_id"] = "123437"
putStudent["username"] = "StudentUniClass@gmail.com"
putStudent["password"] = "pass123"
putStudent["enrolled_classes"] = ["22271", "28363", "22363", "21299", "28013"]
putStudent["security_question"] = "new question2"
putStudent["security_answer"] = "new answer2"


def test_put_student_data_for_testing_class(url):

    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/student', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 201
    data = json.loads(putResponse.content)
    # test if insert was success

    assert data["student_id"] == putStudent["student_id"]
    assert data["name"] == putStudent["name"]
    assert data["password"] == putStudent["password"]
    assert data["username"] == putStudent["username"]
    assert data["security_answer"] == putStudent["security_answer"]
    assert data["security_question"] == putStudent["security_question"]
    assert len(data["enrolled_classes"]) == 5
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudent["enrolled_classes"]

# test getting a class by id


def test_get_uniclass_by_id_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/id/28013')
    data = json.loads(response.content)
    assert response.status_code == 200
    assert data["class-code"] == "28013"
    assert data["class-name"] == "CS 160"
    assert data["dates"] == "01/24/19 05/13/19"
    assert data["days"] == "TR"
    assert data["dept-id"] == "d83848"
    assert data["dept-name"] == "COMPUTER SCIENCE"
    assert data["instructor"] == "W Cao"
    assert data["section"] == "05"
    assert data["location"] == "MH 222"
    assert data["time"] == "1930 2045"
    assert data["title"] == "Software Engr"
    assert data["units"] == "3"
    for student in data["students"]:
        assert student["student_id"] == putStudent["student_id"]

# test getting a class by name


def test_get_uniclass_by_name_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/name/CS 16')
    data = json.loads(response.content)
    assert response.status_code == 200
    for uniclass in data:
        assert "CS 16".lower() in uniclass["class-name"].lower()

# test getting a class by name without spaces


def test_get_uniclass_by_name_without_space_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/name/CS16')
    data = json.loads(response.content)
    assert response.status_code == 200
    for uniclass in data:
        assert "CS 16".lower() in uniclass["class-name"].lower()

# test getting a class by wrong name


def test_get_uniclass_by_name_data_fail(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/name/Bharath')
    data = json.loads(response.content)
    assert response.status_code == 200
    for uniclass in data:
        assert "Bharath".lower() not in uniclass["class-name"].lower()


# test getting a class by title


def test_get_uniclass_by_title(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/title/Software E')
    data = json.loads(response.content)
    assert response.status_code == 200
    for uniclass in data:
        assert "Software E".lower() in uniclass["title"].lower()


# test getting a class by wrong title


def test_get_uniclass_by_title_fail(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/title/Fortnite')
    data = json.loads(response.content)
    assert response.status_code == 200
    for uniclass in data:
        assert "Fortnite".lower() not in uniclass["title"].lower()


# test getting a class by instructor


def test_get_uniclass_by_instructor_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/instructor/W Cao')
    data = json.loads(response.content)
    assert response.status_code == 200
    for uniclass in data:
        assert "W Cao".lower() in uniclass["instructor"].lower()

# test getting classes by dept


def test_get_uniclass_by_dept_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/department/computer')
    data = json.loads(response.content)
    assert response.status_code == 200
    for uniclass in data:
        assert "computer".lower() in uniclass["dept-name"].lower()
# test getting classes by dept fail


def test_get_uniclass_by_dept_data_fail(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/department/apple')
    data = json.loads(response.content)
    assert response.status_code == 200
    for uniclass in data:
        assert "apple".lower() not in uniclass["dept-name"].lower()

# test getting all classes by dept id


def test_get_all_uniclasses_by_dept(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/department/id/d83848')
    data = json.loads(response.content)
    assert response.status_code == 200
    # make sure all the classes are from Computer Science dept
    for uniclass in data:
        assert "Computer Science".lower() in uniclass["dept-name"].lower()

# get list of all depts


def test_get_all_depts(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/department/all')
    data = json.loads(response.content)
    assert response.status_code == 200
    assert len(data) > 1


"""
**************************************
Authentication Driver Tests
**************************************
"""
# check registering student


def test_register(url):
    putStudent = dict()
    putStudent["name"] = "newstudent"
    putStudent["student_id"] = "17"
    putStudent["username"] = "newstudent@gmail.com"
    putStudent["password"] = "pass123"
    putStudent["security_question"] = "new question reg"
    putStudent["security_answer"] = "new answer reg"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.post(
        testAPIBasePath + '/register', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 201
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["student_id"] == putStudent["student_id"]
    assert data["name"] == putStudent["name"]
    assert data["username"] == putStudent["username"]
    assert data["password"] == putStudent["password"]
    assert data["security_question"] == putStudent["security_question"]
    assert data["security_answer"] == putStudent["security_answer"]

# test logging in with the above student


def test_login(url):
    putStudent = dict()
    putStudent["username"] = "newstudent@gmail.com"
    putStudent["password"] = "pass123"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.post(
        testAPIBasePath + '/login', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 200
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["student_id"] == "17"
    assert data["name"] == "newstudent"
    assert data["username"] == putStudent["username"]
    assert data["password"] == putStudent["password"]

# test logging in with a student from mongo seed to ensure that all fields are returned


def test_login_with_mongo_seed_student(url):
    putStudent = dict()
    putStudent["username"] = "lifeng@gmail.com"
    putStudent["password"] = "pass123"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.post(
        testAPIBasePath + '/login', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 200
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["student_id"] == "02"
    assert data["name"] == "Lifeng"
    assert data["username"] == putStudent["username"]
    assert data["password"] == putStudent["password"]
    assert len(data["enrolled_classes"]) == 3
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in ["24778", "30053", "29567"]
    assert len(data["meetings"]) == 2
    for meeting in data["meetings"]:
        assert str(meeting["meeting_id"]) in ["11", "13"]

# test logging in with the wrong password for the above student


def test_login_fail(url):
    putStudent = dict()
    putStudent["username"] = "newstudent@gmail.com"
    putStudent["password"] = "pass1234"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.post(
        testAPIBasePath + '/login', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 404
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["authorization"] == False

# test registering with the same student id again


def test_register_fail(url):
    putStudent = dict()
    putStudent["name"] = "newstudent"
    putStudent["student_id"] = "17"
    putStudent["username"] = "newstudent@gmail.com"
    putStudent["password"] = "pass123"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.post(
        testAPIBasePath + '/register', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 403
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["accountExists"] == True


def test_register_fail_without_security(url):
    putStudent = dict()
    putStudent["name"] = "newstudent2"
    putStudent["student_id"] = "1434357"
    putStudent["username"] = "newstudent@gmail.com"
    putStudent["password"] = "pass123"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.post(
        testAPIBasePath + '/register', data=json.dumps(putStudent), headers=headers)
    assert putResponse.status_code == 400


"""
**************************************
Meeting Driver Tests
**************************************
"""

# check get meeting by peer id


def test_get_meeting_by_peer_id_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/meeting/peer/id/00011')
    data = json.loads(response.content)
    assert len(data) == 2
    for meeting in data:
        assert meeting["peer_id"] == "00011"
        assert meeting["meeting_id"] == "06" or "02"
        assert meeting["tutor_id"] == "10001" or "10002" or "00011"
        assert meeting["meeting_title"] == "title2" or "title3"

# check get meeting by wrong id


def test_get_meeting_by_peer_id_data_fail(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/meeting/peer/id/9999999999')
    data = json.loads(response.content)
    assert len(data) == 0


# check get meeting by tutor id
def test_get_meeting_by_tutor_id_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/meeting/tutor/id/10001')
    data = json.loads(response.content)
    assert len(data) == 1
    for meeting in data:
        assert meeting["tutor_id"] == "10001"
        assert meeting["meeting_id"] == "06" or "05"
        assert meeting["peer_id"] == "00011" or "00012"
        assert meeting["meeting_title"] == "title2"
        assert meeting["location"] == "test location2"

# check get meeting by wrong tutor id


def test_get_meeting_by_tutor_id_data_fail(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/meeting/tutor/id/9999999999')
    data = json.loads(response.content)
    assert len(data) == 0

# check get meeting by meeting id


def test_get_meeting_by_meeting_id_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/meeting/id/06')
    data = json.loads(response.content)
    assert response.status_code == 200
    assert data["meeting_id"] == "06"
    assert data["peer_id"] == "00011"
    assert data["tutor_id"] == "10001"
    assert data["meeting_title"] == "title2"
    assert data["location"] == "test location2"

# check get meeting by wrong meeting id


def test_get_meeting_by_meeting_id_data_fail(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/meeting/id/99999')
    data = json.loads(response.content)
    assert response.status_code == 404


# check get meeting by student id
def test_get_meeting_by_student_id_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/meeting/student/id/00011')
    data = json.loads(response.content)
    assert response.status_code == 200
    assert len(data) == 3
    for meeting in data:
        assert meeting["meeting_id"] == "06" or "02" or "05"
        assert meeting["peer_id"] or meeting["tutor_id"] == "00011"

# check get meeting by wrong student id


def test_get_meeting_by_student_id_data_fail(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/meeting/student/id/999999999')
    data = json.loads(response.content)
    assert response.status_code == 200
    assert len(data) == 0


# check adding meeting
def test_put_meeting_data(url):
    putMeeting = dict()
    putMeeting["meeting_id"] = "111"
    putMeeting["tutor_id"] = "00011"
    putMeeting["peer_id"] = "10003"
    putMeeting["start"] = "11-18-2018 11:00 AM"
    putMeeting["end"] = "11-18-2018 10:00 AM"
    putMeeting["meeting_title"] = "added this new meeting"
    putMeeting["location"] = "test location"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/meeting', data=json.dumps(putMeeting), headers=headers)
    assert putResponse.status_code == 201
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["meeting_id"] == putMeeting["meeting_id"]
    assert data["peer_id"] == putMeeting["peer_id"]
    assert data["tutor_id"] == putMeeting["tutor_id"]
    assert data["start"] == putMeeting["start"]
    assert data["end"] == putMeeting["end"]
    assert data["location"] == putMeeting["location"]
    assert data["meeting_title"] == putMeeting["meeting_title"]

# check adding meeting without meeting start


def test_put_meeting_data_no_start_fail(url):
    putMeeting = dict()
    putMeeting["meeting_id"] = "11135345646"
    putMeeting["tutor_id"] = "00011"
    putMeeting["peer_id"] = "10003"
    putMeeting["end"] = "11-18-2018 10:00 AM"
    putMeeting["meeting_title"] = "fail meeting"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/meeting', data=json.dumps(putMeeting), headers=headers)
    assert putResponse.status_code == 400

# check adding meeting without meeting title


def test_put_meeting_data_no_title_fail(url):
    putMeeting = dict()
    putMeeting["meeting_id"] = "11135345646"
    putMeeting["tutor_id"] = "00011"
    putMeeting["peer_id"] = "10003"
    putMeeting["start"] = "11-18-2018 11:00 AM"
    putMeeting["end"] = "11-18-2018 10:00 AM"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/meeting', data=json.dumps(putMeeting), headers=headers)
    assert putResponse.status_code == 400

# check adding meeting without meeting start or end


def test_put_meeting_data_no_start_end_fail(url):
    putMeeting = dict()
    putMeeting["meeting_id"] = "1113242424"
    putMeeting["tutor_id"] = "00011"
    putMeeting["peer_id"] = "10003"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/meeting', data=json.dumps(putMeeting), headers=headers)
    assert putResponse.status_code == 400


# check modifying the meeting added above
def test_modify_meeting_data(url):
    putMeeting = dict()
    putMeeting["meeting_id"] = "111"
    putMeeting["tutor_id"] = "00012"
    putMeeting["peer_id"] = "10004"
    putMeeting["start"] = "11-11-2018 1:00 PM"
    putMeeting["end"] = "11-11-2018 2:00 PM"
    putMeeting["meeting_title"] = "edited this  meeting"
    putMeeting["location"] = "test location2"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/meeting', data=json.dumps(putMeeting), headers=headers)
    assert putResponse.status_code == 200
    data = json.loads(putResponse.content)
    # test if insert was success

    assert data["meeting_id"] == putMeeting["meeting_id"]
    assert data["tutor_id"] == putMeeting["tutor_id"]
    assert data["peer_id"] == putMeeting["peer_id"]
    assert data["start"] == putMeeting["start"]
    assert data["end"] == putMeeting["end"]
    assert data["meeting_title"] == putMeeting["meeting_title"]


"""
**************************************
Rating Driver Tests
**************************************
"""
# check get rating by id


def test_get_rating_by_id(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/rating/id/01')
    data = json.loads(response.content)
    assert response.status_code == 200
    assert data["rating_id"] == "01"
    assert data["given"] == "02"
    assert data["received"] == "04"
    assert data["comment"] == "02 to 04 Very good comment"
    assert data["rating_score"] == "4"

# check get avg rating by id


def test_get_avg_rating_by_id(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/rating/avg/04')
    assert response.status_code == 200

# check get avg rating by id when there are no ratings for the user


def test_get_avg_rating_by_id_no_ratings(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/rating/avg/00012')
    assert response.status_code == 200
    assert int(response.content) == 0

# check get rating by wrong id


def test_get_rating_by_id_fail(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/rating/id/99999')
    data = json.loads(response.content)
    assert response.status_code == 404
# check get rating by given student id


def test_get_rating_by_given_id(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/rating/given/02')
    data = json.loads(response.content)
    assert response.status_code == 200
    assert len(data) == 1
    for rating in data:
        assert rating["rating_id"] == "01"
        assert rating["given"] == "02"
        assert rating["received"] == "04"
        assert rating["comment"] == "02 to 04 Very good comment"
        assert rating["rating_score"] == "4"
# check get rating by received student id


def test_get_rating_by_received_id(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/rating/received/04')
    data = json.loads(response.content)
    assert response.status_code == 200
    assert len(data) == 2
    for rating in data:
        assert rating["rating_id"] == "01" or "02"
        assert rating["given"] == "02" or "06"
        assert rating["received"] == "04"
        assert rating["comment"] == "02 to 04 Very good comment" or "06 to 04 good comment"
        assert rating["rating_score"] == "4" or "5"


# check adding rating
def test_put_rating_data(url):
    rating_dict = dict()
    rating_dict["rating_id"] = "03"
    rating_dict["given"] = "00011"
    rating_dict["received"] = "00012"
    rating_dict["rating_score"] = "1"
    rating_dict["comment"] = "lorem imposeom3"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/rating', data=json.dumps(rating_dict), headers=headers)
    assert putResponse.status_code == 201
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["rating_id"] == rating_dict["rating_id"]
    assert data["given"] == rating_dict["given"]
    assert data["received"] == rating_dict["received"]
    assert data["rating_score"] == rating_dict["rating_score"]
    assert data["comment"] == rating_dict["comment"]

# check modifying the rating added above


def test_modify_rating_data(url):
    rating_dict = dict()
    rating_dict["rating_id"] = "03"
    rating_dict["given"] = "00011"
    rating_dict["received"] = "00012"
    rating_dict["rating_score"] = "1"
    rating_dict["comment"] = "lorem imposeom5"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/rating', data=json.dumps(rating_dict), headers=headers)
    assert putResponse.status_code == 200
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["rating_id"] == rating_dict["rating_id"]
    assert data["given"] == rating_dict["given"]
    assert data["received"] == rating_dict["received"]
    assert data["rating_score"] == rating_dict["rating_score"]
    assert data["comment"] == rating_dict["comment"]

# check adding rating without given student id


def test_put_rating_data_fail(url):
    rating_dict = dict()
    rating_dict["rating_id"] = "05"
    rating_dict["received"] = "00012"
    rating_dict["rating_score"] = "1"
    rating_dict["comment"] = "lorem imposeom fail"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/rating', data=json.dumps(rating_dict), headers=headers)
    assert putResponse.status_code == 400
    data = json.loads(putResponse.content)


# check modifying rating without providing correct given student id


def test_modify_rating_data_fail(url):
    rating_dict = dict()
    rating_dict["rating_id"] = "03"
    rating_dict["given"] = "00014"
    rating_dict["received"] = "00012"
    rating_dict["rating_score"] = "1"
    rating_dict["comment"] = "lorem imposeom fail"
    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/rating', data=json.dumps(rating_dict), headers=headers)
    assert putResponse.status_code == 400
    data = json.loads(putResponse.content)


"""
**************************************
**************************************
**************************************
Multi Driver Tests
**************************************
**************************************
**************************************
"""
"""
**************************************
Multi Driver Test #1
Add 2 new students
Schedule a meeting between the both of them
**************************************
"""
putStudentA = dict()
putStudentA["name"] = "StudentA"
putStudentA["student_id"] = "12321"
putStudentA["username"] = "studentA@gmail.com"
putStudentA["password"] = "pass123"
putStudentA["enrolled_classes"] = ["27264", "28363"]
putStudentA["security_question"] = "new questionA"
putStudentA["security_answer"] = "new answerA"


def test_multi_driver_test1_add_studentA(url):

    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/student', data=json.dumps(putStudentA), headers=headers)
    assert putResponse.status_code == 201
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["student_id"] == putStudentA["student_id"]
    assert data["name"] == putStudentA["name"]
    assert data["password"] == putStudentA["password"]
    assert data["username"] == putStudentA["username"]
    assert data["security_question"] == putStudentA["security_question"]
    assert data["security_answer"] == putStudentA["security_answer"]
    assert len(data["enrolled_classes"]) == len(
        putStudentA["enrolled_classes"])
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudentA["enrolled_classes"]


putStudentB = dict()
putStudentB["name"] = "StudentB"
putStudentB["student_id"] = "14435"
putStudentB["username"] = "studentB@gmail.com"
putStudentB["password"] = "pass1233"
putStudentB["enrolled_classes"] = ["23381", "21808", "28013"]
putStudentB["security_question"] = "new questionB"
putStudentB["security_answer"] = "new answerB"


def test_multi_driver_test1_add_studentB(url):

    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/student', data=json.dumps(putStudentB), headers=headers)
    assert putResponse.status_code == 201
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["student_id"] == putStudentB["student_id"]
    assert data["name"] == putStudentB["name"]
    assert data["password"] == putStudentB["password"]
    assert data["username"] == putStudentB["username"]
    assert data["security_question"] == putStudentB["security_question"]
    assert data["security_answer"] == putStudentB["security_answer"]
    assert len(data["enrolled_classes"]) == len(
        putStudentB["enrolled_classes"])
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudentB["enrolled_classes"]


putMeeting = dict()
putMeeting["meeting_id"] = "142411"
putMeeting["tutor_id"] = putStudentA["student_id"]
putMeeting["peer_id"] = putStudentB["student_id"]
putMeeting["start"] = "11-1-2018 1:00 PM"
putMeeting["end"] = "11-1-2018 2:00 PM"
putMeeting["meeting_title"] = "Example meeting title"


def test_put_meeting_data_btw_A_B(url):

    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/meeting', data=json.dumps(putMeeting), headers=headers)
    assert putResponse.status_code == 201
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["meeting_id"] == putMeeting["meeting_id"]
    assert data["peer_id"] == putStudentB["student_id"]
    assert data["tutor_id"] == putStudentA["student_id"]
    assert data["start"] == putMeeting["start"]
    assert data["end"] == putMeeting["end"]


def test_get_meeting_data_btw_A_B(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(
        testAPIBasePath + '/meeting/id/{}'.format(putMeeting["meeting_id"]))
    data = json.loads(response.content)
    assert response.status_code == 200
    assert data["meeting_id"] == putMeeting["meeting_id"]
    assert data["peer_id"] == putStudentB["student_id"]
    assert data["tutor_id"] == putStudentA["student_id"]
    assert data["start"] == putMeeting["start"]
    assert data["end"] == putMeeting["end"]
    assert data["meeting_title"] == putMeeting["meeting_title"]


def test_get_meeting_from_get_student_A(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(
        testAPIBasePath + '/student/id/{}'.format(putStudentA["student_id"]))
    data = json.loads(response.content)
    assert response.status_code == 200
    assert data["student_id"] == putStudentA["student_id"]
    assert data["name"] == putStudentA["name"]
    assert len(data["enrolled_classes"]) == len(
        putStudentA["enrolled_classes"])
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudentA["enrolled_classes"]
    assert len(data["meetings"]) == 1
    for meeting in data["meetings"]:
        assert str(meeting["meeting_id"]) in putMeeting["meeting_id"]


def test_get_meeting_from_get_student_B(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(
        testAPIBasePath + '/student/id/{}'.format(putStudentB["student_id"]))
    data = json.loads(response.content)
    assert response.status_code == 200
    assert data["student_id"] == putStudentB["student_id"]
    assert data["name"] == putStudentB["name"]
    assert len(data["enrolled_classes"]) == len(
        putStudentB["enrolled_classes"])
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudentB["enrolled_classes"]
    assert len(data["meetings"]) == 1
    for meeting in data["meetings"]:
        assert str(meeting["meeting_id"]) in putMeeting["meeting_id"]


"""
**************************************
Multi Driver Test #2
Add 2 new students to the same class and check if the class then has both students
**************************************
"""
putStudentC = dict()
putStudentC["name"] = "StudentInClassA"
putStudentC["student_id"] = "1232122"
putStudentC["username"] = "StudentInClassA@gmail.com"
putStudentC["password"] = "pass123"
putStudentC["enrolled_classes"] = ["24415"]
putStudentC["security_question"] = "new questionC"
putStudentC["security_answer"] = "new answerC"

putStudentD = dict()
putStudentD["name"] = "StudentInClassB"
putStudentD["student_id"] = "1232123"
putStudentD["username"] = "StudentInClassB@gmail.com"
putStudentD["password"] = "pass123"
putStudentD["enrolled_classes"] = ["24415"]
putStudentD["security_question"] = "new questionD"
putStudentD["security_answer"] = "new answerD"


def test_multi_driver_test1_add_studentInClassA(url):

    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/student', data=json.dumps(putStudentC), headers=headers)
    assert putResponse.status_code == 201
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["student_id"] == putStudentC["student_id"]
    assert data["name"] == putStudentC["name"]
    assert data["password"] == putStudentC["password"]
    assert data["username"] == putStudentC["username"]
    assert data["security_question"] == putStudentC["security_question"]
    assert data["security_answer"] == putStudentC["security_answer"]
    assert len(data["enrolled_classes"]) == len(
        putStudentC["enrolled_classes"])
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudentC["enrolled_classes"]


def test_multi_driver_test1_add_studentInClassB(url):

    headers = {'content-type': 'application/json'}
    testAPIBasePath = "{}/test/api".format(url)
    putResponse = requests.put(
        testAPIBasePath + '/student', data=json.dumps(putStudentD), headers=headers)
    assert putResponse.status_code == 201
    data = json.loads(putResponse.content)
    # test if insert was success
    assert data["student_id"] == putStudentD["student_id"]
    assert data["name"] == putStudentD["name"]
    assert data["password"] == putStudentD["password"]
    assert data["username"] == putStudentD["username"]
    assert data["security_question"] == putStudentD["security_question"]
    assert data["security_answer"] == putStudentD["security_answer"]
    assert len(data["enrolled_classes"]) == len(
        putStudentD["enrolled_classes"])
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudentD["enrolled_classes"]


def test_get_uniclass_with_both_students(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/uniclass/id/24415')
    data = json.loads(response.content)
    assert response.status_code == 200
    assert data["class-code"] == "24415"
    assert len(data["students"]) == 2
    for student in data["students"]:
        assert student["student_id"] == putStudentC["student_id"] or putStudentD["student_id"]
# this is for debugging individual tests
# if __name__ == "__main__":
#     test_hello_data()
