from fastapi.testclient import TestClient
import boto3
from moto import mock_s3
from main import app

test_app = TestClient(app)


@mock_s3
def test_files_correct_file():
    """
    Given a file
    When the user calls the endpoint
    Then it saves the file in the bucket.
    """
    
    conn = boto3.resource('s3', region_name='us-east-1')
    conn.create_bucket(Bucket='tdg-s3-bucket')

    response = test_app.post(
        "/api/files", files={"upload_file": open("main.py", "rb")}
    )
    assert response.status_code == 200
    assert response.headers["Access-Control-Allow-Origin"] == "*"

@mock_s3
def test_files_override_file():
    """
    Given a file
    When there is a already a file with that name saved in the bucket
    Then the file should be overwritten.
    """

    conn = boto3.resource('s3')
    conn.create_bucket(Bucket='tdg-s3-bucket')

    s3 = boto3.client('s3')
    s3.put_object(Bucket='tdg-s3-bucket', Key="main.py", Body="test")
    
    response = test_app.post(
        "/api/files", files={"upload_file": open("main.py", "rb")}
    )
    assert response.status_code == 200
    assert response.headers["Access-Control-Allow-Origin"] == "*"

