from fastapi.testclient import TestClient
import boto3
from moto import mock_s3
from main import app

test_app = TestClient(app)


@mock_s3
def test_files_valid_file_extension(tmpdir):
    """
    Given a file with a valid extension
    When the user calls the endpoint
    Then it saves the file in the bucket and returns 200 Ok.
    """

    for extension in ["pptx", "docx", "xlsx"]:

        doc = tmpdir.join("hello." + extension)
        doc.write("content")

        conn = boto3.resource('s3')
        conn.create_bucket(Bucket='tdg-s3-bucket')

        with open(doc, "rb") as file:
            response = test_app.post(
                "/api/1/files", files={"upload_file": file}, data={"filename": "test"}
            )

        assert response.status_code == 200
        assert "Success" in response.json()["message"]
        assert "test." + extension in response.json()["message"]
        assert response.headers["Access-Control-Allow-Origin"] == "*"


@mock_s3
def test_files_correct_upload_directory(tmpdir):
    """
    Given a file with a valid extension
    When the file is uploaded
    Then it must be in the correct directory in the storage.
    """
    for format, extension in [("powerpoint", "pptx"), ("word", "docx"), ("excel", "xlsx")]:

        filename = "test"
        doc = tmpdir.join("hello." + extension)
        doc.write("content")

        conn = boto3.resource('s3')
        conn.create_bucket(Bucket='tdg-s3-bucket')

        s3 = boto3.client('s3')
        prefix = "template/" + format
        path = prefix + "/" + filename + "." + extension

        response_obj = s3.list_objects_v2(Bucket='tdg-s3-bucket', Prefix=prefix)
        assert response_obj["KeyCount"] == 0

        with open(doc, "rb") as file:
            response = test_app.post(
                "/api/1/files", files={"upload_file": file}, data={"filename": filename}
            )

        response_obj = s3.list_objects_v2(Bucket='tdg-s3-bucket', Prefix=prefix)
        assert len(response_obj["Contents"]) == 1
        assert response_obj["Contents"][0]["Key"] == path

        assert response.status_code == 200
        assert response.headers["Access-Control-Allow-Origin"] == "*"


@mock_s3
def test_files_override_file(tmpdir):
    """
    Given a file with a valid extension
    When there is a already a file with that name saved in the bucket
    Then the file should be overwritten.
    """
    for format, extension in [("powerpoint", "pptx"), ("word", "docx"), ("excel", "xlsx")]:

        filename = "test"
        doc = tmpdir.join("hello." + extension)
        doc.write("content")

        conn = boto3.resource('s3')
        conn.create_bucket(Bucket='tdg-s3-bucket')

        s3 = boto3.client('s3')
        path = "template/" + format + "/" + filename + "." + extension
        s3.put_object(Bucket='tdg-s3-bucket', Key=path, Body="test")

        with open(doc, "rb") as file:
            response = test_app.post(
                "/api/1/files", files={"upload_file": file}, data={"filename": filename}
            )
        assert response.status_code == 200
        assert response.headers["Access-Control-Allow-Origin"] == "*"

        response_obj = s3.list_objects_v2(Bucket='tdg-s3-bucket', Prefix=path)
        assert response_obj["KeyCount"] == 1

        response_obj = s3.get_object(Bucket='tdg-s3-bucket', Key=path)
        assert response_obj["Body"].read().decode() == "content"


@mock_s3
def test_files_invalid_extension(tmpdir):
    """
    Given a file with an invalid extension
    When the file is sent to the endpoint
    Then the request must respond with status code of 400.
    """

    conn = boto3.resource('s3')
    conn.create_bucket(Bucket='tdg-s3-bucket')

    filename = "test"
    doc = tmpdir.join("hello." + "txt")
    doc.write("content")

    with open(doc, "rb") as file:
        response = test_app.post(
            "/api/1/files", files={"upload_file": file}, data={"filename": filename}
        )

    assert response.status_code == 400
    assert "not supported" in response.json()["message"]
