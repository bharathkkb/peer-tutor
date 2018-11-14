
from swagger_spec_validator import validate_spec_url
import flex
import requests
from flex.core import load, validate_api_call
import pprint
import pytest
import json
import sys


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


# testing get student endpoint

# check get student by id
def test_get_student_by_id_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/student/id/02')
    data = json.loads(response.content)
    print(data)
    assert data["student_id"] == "02"
    assert data["name"] == "Lifeng"

# check get student by name


def test_get_student_by_name_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/student/name/lif')
    data = json.loads(response.content)
    print(data)
    # since return is a list use data[0]
    assert data[0]["student_id"] == "02"
    assert data[0]["name"] == "Lifeng"

# check adding student


def test_put_student_data(url):
    putStudent = dict()
    putStudent["name"] = "BharathUpdate"
    putStudent["student_id"] = "07"
    putStudent["username"] = "bharathupdate@gmail.com"
    putStudent["password"] = "pass123"
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

# check modifying the student added above


def test_modify_student_data(url):
    putStudent = dict()
    putStudent["name"] = "Bharath"
    putStudent["student_id"] = "07"
    putStudent["username"] = "bharathupdate2@gmail.com"
    putStudent["password"] = "pass12345"
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

# check get meeting by id
def test_get_meeting_by_peer_id_data(url):
    testAPIBasePath = "{}/test/api".format(url)
    response = requests.get(testAPIBasePath + '/meeting/peer/id/00011')
    data = json.loads(response.content)
    print(data)
    assert len(data) == 2
    for meeting in data:
        assert data[0]["meeting_id"] == "06" or "02"
    assert data[0] ["meeting_id"] == "06"
    # assert data [0]["peer_id"] == "00011"
    # assert data[0] ["tutor_id"] == "10001"
    



# this is for debugging individual tests
# if __name__ == "__main__":
#     test_hello_data()
