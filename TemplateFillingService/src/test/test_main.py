from fastapi.testclient import TestClient
import boto3
from moto import mock_s3
from main import app

test_app = TestClient(app)


@mock_s3
def test_fill_excel_file():
    """
    Given a template_filename, a JSON file and an output_filename
    When the user calls the endpoint
    Then it saves the file with the output_filename in the bucket filled with the JSON data
    """
    test_path = "test/templates/excel/Templates/1_template_standardExcel/"

    template_filename = "template"
    output_filename = "test"
    extension = "xlsx"
    format = "excel"

    conn = boto3.resource('s3', region_name='us-east-1')
    conn.create_bucket(Bucket='tdg-s3-bucket')

    s3 = boto3.client('s3')

    path = "template/" + format + "/" + template_filename + "." + extension
    path_filled = "filled/" + format + "/" + output_filename + "." + extension

    s3.put_object(Bucket='tdg-s3-bucket', Key=path, Body=open(test_path + "input_standardExcel-Template.xlsx", "rb"))

    response = test_app.post(
        "/api/3/fill", files={"upload_file": open(test_path + "input_standardExcel-Data.json", "rb")},
        data={"retrieval_filename": path, "output_filename": output_filename}
    )

    assert response.status_code == 200
    
    # filled file was created and saved in the correct folder
    assert s3.get_object(Bucket='tdg-s3-bucket', Key=path_filled)


@mock_s3
def test_fill_powerpoint_file():
    """
    Given a template_filename, a JSON file and an output_filename
    When the user calls the endpoint
    Then it saves the file with the output_filename in the bucket filled with the JSON data
    """
    test_path = "test/templates/powerpoint/Templates/1_template_standardPPT/"

    template_filename = "template"
    output_filename = "test"
    extension = "pptx"
    format = "powerpoint"

    conn = boto3.resource('s3', region_name='us-east-1')
    conn.create_bucket(Bucket='tdg-s3-bucket')

    s3 = boto3.client('s3')

    path = "template/" + format + "/" + template_filename + "." + extension
    path_filled = "filled/" + format + "/" + output_filename + "." + extension

    s3.put_object(Bucket='tdg-s3-bucket', Key=path, Body=open(test_path + "input_UserData-Template.pptx", "rb"))

    response = test_app.post(
        "/api/3/fill", files={"upload_file": open(test_path + "input_UserData_DataSubset.json", "rb")},
        data={"retrieval_filename": path, "output_filename": output_filename}
    )

    assert response.status_code == 200
    
    # filled file was created and saved in the correct folder
    assert s3.get_object(Bucket='tdg-s3-bucket', Key=path_filled)
