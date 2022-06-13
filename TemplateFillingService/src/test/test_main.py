from fastapi.testclient import TestClient
import boto3
from moto import mock_s3
from main import app, fill_excel_template, fill_ppt_template, fill_docx_template
import json
import pytest
import os

test_app = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def cleanup(request):
    """Cleanup a testing directory once we are finished."""
    def remove_test_dir():
        path = "."
        for file in os.listdir(path):
            for extension in (".xlsx", ".docx", ".pptx"):
                if file.endswith(extension):
                    os.remove(os.path.join(path, file))
    request.addfinalizer(remove_test_dir)


excel_test_path = "test/templates/excel/Templates/1_template_standardExcel/"
ppt_test_path = "test/templates/powerpoint/Templates/1_template_standardPPT/"
word_test_path = "test/templates/word/Templates/1_template_simpleWord/"

parameters = [
    (excel_test_path, "test_template.xlsx", "test",
     "xlsx", "excel", "valid_data.json", 200),
    (excel_test_path, "test_template.xlsx", "test",
     "xlsx", "excel", "invalid_data.json", 400),
    (excel_test_path, "test_template.xlsx", "test",
     "xlsx", "excel", "invalid_file.json", 400),
    (ppt_test_path, "test_template.pptx", "test",
     "pptx", "powerpoint", "valid_data_sm.json", 200),
    (ppt_test_path, "test_template.pptx", "test",
     "pptx", "powerpoint", "invalid_data.json", 400),
    (ppt_test_path, "test_template.pptx", "test",
     "pptx", "powerpoint", "invalid_file.json", 400),
    (word_test_path, "test_template.docx", "test",
     "docx", "word", "valid_data.json", 200),
    (word_test_path, "test_template.docx", "test",
     "docx", "word", "invalid_data.json", 400),
    (word_test_path, "test_template.docx", "test",
     "docx", "word", "invalid_file.json", 400),
]


@pytest.mark.parametrize("test_path, template_filename, output_filename, extension, format, json_file, status_code",
                         parameters)
@mock_s3
def test_fill_template_endpoint(
    test_path, template_filename, output_filename, extension, format, json_file, status_code
):
    """
    Given a template and the data to fill
    When the endpoint is called
    Then the response should be correct
    """

    conn = boto3.resource('s3', region_name='us-east-1')
    conn.create_bucket(Bucket='tdg-s3-bucket')

    s3 = boto3.client('s3')

    user = "test"

    path = "template/" + format + "/" + template_filename + "." + extension
    path_filled = user + "/filled/" + format + "/" + output_filename + "." + extension

    s3.put_object(Bucket='tdg-s3-bucket', Key=user + "/" + path,
                  Body=open(test_path + template_filename, "rb"))

    response = test_app.post(
        "/api/3/fill", files={"upload_file": open(test_path + json_file, "rb")},
        data={"retrieval_filename": path, "output_filename": output_filename},
        headers={"username": user}
    )

    assert response.status_code == status_code

    # filled file was created and saved in the correct folder
    if status_code == 200:
        assert s3.get_object(Bucket='tdg-s3-bucket', Key=path_filled)


filled_paramaters = [
    (fill_excel_template, excel_test_path, "test_template.xlsx",
     "valid_data.json", "test.xlsx", True),
    (fill_excel_template, excel_test_path, "test_template.xlsx",
     "invalid_data.json", "test.xlsx", False),
    (fill_ppt_template, ppt_test_path, "test_template.pptx",
     "valid_data_sm.json", "test.pptx", True),
    (fill_ppt_template, ppt_test_path, "test_template.pptx",
     "invalid_data.json", "test.pptx", False),
    (fill_docx_template, word_test_path, "test_template.docx",
     "valid_data.json", "test.docx", True),
    (fill_docx_template, word_test_path, "test_template.docx",
     "invalid_data.json", "test.docx", False),
]


@pytest.mark.parametrize("fill_func, test_path, template_file, data_file, filled_name, valid", filled_paramaters)
def test_fill_data(fill_func, test_path, template_file, data_file, filled_name, valid):

    template_path = test_path + template_file
    data = json.load(open(test_path + data_file))

    result = fill_func(template_name=template_path,
                       data=data, filled_file_name=filled_name)

    assert result == valid
