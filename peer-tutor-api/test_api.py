
from swagger_spec_validator import validate_spec_url
import flex
import requests
from flex.core import load, validate_api_call
import pprint
import pytest
import json

testAPIBasePath = "http://localhost:5000/test/api"

# helper for validate swagger spec


def validateSwagger():
    validate_spec_url(testAPIBasePath + '/swagger.json')

# check connection to server


def test_case_connection():
    response = requests.get(testAPIBasePath + '/hello')
    assert response.status_code == 200

# pytest for validating swagger schema


def test_validateSwagger():
    assert validateSwagger() == None

# helper for validate hello schema


def hello_schema(schema):
    response = requests.get(testAPIBasePath + '/hello')
    validate_api_call(schema, raw_request=response.request,
                      raw_response=response)

# pytest for validating hello schema


def test_hello_schema():
    schema = flex.load(testAPIBasePath + '/swagger.json')
    assert hello_schema(schema) == None

# pytest for validating data returned by /hello endpoint


def test_hello_data():
    response = requests.get(testAPIBasePath + '/hello')
    data = json.loads(response.content)
    print(data)
    assert data["hello"] == "hello"

# this is for debugging individual tests
# if __name__ == "__main__":
#     test_hello_data()
