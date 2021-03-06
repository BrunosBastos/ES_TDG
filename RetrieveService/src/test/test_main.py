from fastapi.testclient import TestClient
import boto3
from moto import mock_s3
from main import app

test_app = TestClient(app)
bucket_name = 'tdg-s3-bucket'


@mock_s3
def test_return_file_names_and_size():
    """
    Given a user
    When he request the templates that have been stored in the S3
    The the API should return their file names and size
    """
    user = "test"
    conn = boto3.resource('s3')
    conn.create_bucket(Bucket=bucket_name)

    s3 = boto3.client('s3')
    prefix = user + "/template"
    s3.put_object(Bucket=bucket_name, Key=prefix +
                  "/excel/text1.xlsx", Body="test")
    s3.put_object(Bucket=bucket_name, Key=prefix +
                  "/word/text2.docx", Body="test")

    response = test_app.get("/api/2/files", headers={"username": user})

    assert response.status_code == 200
    assert response.headers["Access-Control-Allow-Origin"] == "*"
    assert response.json()["data"][0]["name"] == "text1.xlsx"
    assert response.json()["data"][0]["type"] == "template"
    assert response.json()["data"][0]["format"] == "excel"

    assert response.json()["data"][1]["name"] == "text2.docx"
    assert response.json()["data"][1]["type"] == "template"
    assert response.json()["data"][1]["format"] == "word"


@mock_s3
def test_return_file_not_authenticated():
    """
    Given a request
    When the username is not provided in the headers
    Then it should respond with a 401 status code
    """

    response = test_app.get("/api/2/files")
    assert response.status_code == 401


@mock_s3
def test_return_downloaded_file():
    """
    Given a template in S3
    When the user tries to access it
    Then it should be downloaded.
    """

    user = "test"
    conn = boto3.resource('s3')
    conn.create_bucket(Bucket=bucket_name)
    file_name = "template/excel/text1.xlsx"

    s3 = boto3.client('s3')
    s3.put_object(Bucket=bucket_name, Key=user + "/" + file_name, Body="test")

    response = test_app.get("/api/2/files/" + file_name,
                            headers={"username": user})

    assert response.status_code == 200
    assert response._content == b"test"
    assert response.headers['content-type'] == 'application/octet-stream'


@mock_s3
def test_error_when_downloaded_file_not_found():
    """
    Given a template in S3
    When the user tries to access it
    Then it should be downloaded.
    """

    user = "test"
    conn = boto3.resource('s3')
    conn.create_bucket(Bucket=bucket_name)
    file_name = user + "/template/excel/text1.xlsx"

    s3 = boto3.client('s3')
    s3.put_object(Bucket=bucket_name, Key=file_name, Body="test")

    response = test_app.get(
        "/api/2/files/template/excel/wrong_file", headers={"username": user})

    assert response.status_code == 404
    assert response.headers["Access-Control-Allow-Origin"] == "*"


@mock_s3
def test_download_file_not_authenticated():
    """
    Given a request
    When the username is not provided in the headers
    Then it should respond with a 401 status code
    """

    response = test_app.get("/api/2/files/template/excel/correct_file.docx")
    assert response.status_code == 401
