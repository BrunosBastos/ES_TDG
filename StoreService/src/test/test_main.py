from fastapi.testclient import TestClient
import pytest, boto3, os
from moto import mock_s3

from main import app
from utils import get_client_s3

test_app = TestClient(app)
"""
def override_get_client_s3():
    with mock_s3():
        return 


app.dependency_overrides[get_client_s3] = override_get_client_s3
"""

@pytest.fixture
def aws_credentials():
    """Mocked AWS Credentials for moto."""
    os.environ["AWS_ACCESS_KEY_ID"] = "testing"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
    os.environ["AWS_SECURITY_TOKEN"] = "testing"
    os.environ["AWS_SESSION_TOKEN"] = "testing"

@mock_s3
def test_files_correct_file():
    
    # We need to create the bucket since this is all in Moto's 'virtual' AWS account
    conn = boto3.resource('s3', region_name='us-east-1')
    conn.create_bucket(Bucket='tdg-s3-bucket')

    #s3 = boto3.client('s3', region_name='us-east-1')
    #s3.put_object(Bucket='mybucket', Key="test", Body="test")


    response = test_app.post(
        "/files", files={"upload_file": open("main.py", "rb")}
    )
    print(response.text)
    assert response.status_code == 200



