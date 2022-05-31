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

    conn = boto3.resource('s3')
    conn.create_bucket(Bucket=bucket_name)

    s3 = boto3.client('s3')
    s3.put_object(Bucket=bucket_name, Key="text1.xlsx", Body="test")
    s3.put_object(Bucket=bucket_name, Key="text2.docx", Body="test")

    response = test_app.get("/api/2/files")

    assert response.status_code == 200
    assert response.headers["Access-Control-Allow-Origin"] == "*"
    assert response.json()["data"][0]["Name"] == "text1.xlsx"
    assert response.json()["data"][1]["Name"] == "text2.docx"


@mock_s3
def test_return_downloaded_file():
    """
    Given a template in S3
    When the user tries to access it
    Then it should be downloaded.
    """
    conn = boto3.resource('s3')
    conn.create_bucket(Bucket=bucket_name)
    file_name = "text1.xlsx"

    s3 = boto3.client('s3')
    s3.put_object(Bucket=bucket_name, Key=file_name, Body="test")

    response = test_app.get("/api/2/files/" + file_name)

    assert response.status_code == 200
    assert response._content == b"test"
    assert response.headers['content-type'] == 'application/octet-stream'
