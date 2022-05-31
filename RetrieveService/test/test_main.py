from fastapi.testclient import TestClient
import boto3
from moto import mock_s3
from main import app

test_app = TestClient(app)


@mock_s3
def test_return_file_names_and_size():
    """
    Given a user
    When he request the templates that have been stored in the S3
    The the API should return their file names and size
    :return:
    """

    conn = boto3.resource('s3')
    conn.create_bucket(Bucket='tdg-s3-bucket')

    s3 = boto3.client('s3')
    s3.put_object(Bucket='tdg-s3-bucket', Key="text1.xlsx", Body="test")
    s3.put_object(Bucket='tdg-s3-bucket', Key="text2.docx", Body="test")

    response = test_app.get(
        "/api/2/files"
    )

    assert response.status_code == 200
    assert response.json()["data"][0]["Name"] == "text1.xlsx"
    assert response.json()["data"][1]["Name"] == "text2.docx"
