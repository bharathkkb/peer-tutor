
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
"""
**************************************
Setup
**************************************
"""
seedUsersMeetings()
seedUniClasses()

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
    response = requests.get(testAPIBasePath + '/hello')
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
    print(data)
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
    assert len(data["enrolled_classes"]) == 3
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]) in ["24778", "30053", "29567"]

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
    putStudent["enrolled_classes"] = ["22271", "28363", "22363", "21299"]
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
    assert len(data["enrolled_classes"]) == 4
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudent["enrolled_classes"]

# check modifying the student added above


def test_modify_student_data(url):
    putStudent = dict()
    putStudent["name"] = "Bharath"
    putStudent["student_id"] = "07"
    putStudent["username"] = "bharathupdate2@gmail.com"
    putStudent["password"] = "pass12345"
    putStudent["enrolled_classes"] = ["22271"]
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
    assert len(data["enrolled_classes"]) == 1
    for enrolled_class in data["enrolled_classes"]:
        assert str(enrolled_class["class-code"]
                   ) in putStudent["enrolled_classes"]


"""
**************************************
University Class Driver Tests
**************************************
"""

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
    putMeeting["meeting_id"] = "11"
    putMeeting["tutor_id"] = "00011"
    putMeeting["peer_id"] = "10003"
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


# check modifying the meeting added above
def test_modify_meeting_data(url):
    putMeeting = dict()
    putMeeting["meeting_id"] = "11"
    putMeeting["tutor_id"] = "00012"
    putMeeting["peer_id"] = "10004"
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


# this is for debugging individual tests
# if __name__ == "__main__":
#     test_hello_data()
