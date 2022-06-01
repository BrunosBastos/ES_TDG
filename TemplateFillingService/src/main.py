import logging
from fastapi import FastAPI, UploadFile, File, Depends, Form
from fastapi.responses import JSONResponse
from botocore.exceptions import ClientError
import boto3

import json
import openpyxl as oxl
import docx

from utils import create_response, get_client_s3

# TODO: remove this import after done
import os
import re

app = FastAPI()
bucket_name = "tdg-s3-bucket"

# Logger
logging.basicConfig(
    format="%(module)-20s:%(levelname)-15s| %(message)s",
    level=logging.INFO
)


@app.post("/api/3/fill")
async def post_template(
        upload_file: UploadFile = File(...),
        retrieval_filename: str = Form(),
        output_filename: str = Form(),
        s3=Depends(get_client_s3)
) -> JSONResponse:
    """
    Endpoint ``/fill`` that accepts the method POST. Receives a JSON file
    and a template name.

    Parameters
    ----------
        upload_file : `UploadFile`
            The file provided in the POST request

    Returns
    -------
        response : `JSONResponse`
            Json response with the status code and data containing the message
            and data.

    """
    try:
        # load json data
        data = json.load(upload_file.file)

        s3_client = boto3.client("s3")
        bucket_name = "tdg-s3-bucket"
        s3_client.download_file(
            bucket_name, retrieval_filename, retrieval_filename
        )

        fill_template(retrieval_filename, data, output_filename)

        s3.upload_fileobj(
            open(output_filename, "rb"), bucket_name, output_filename
        )

        return create_response(status_code=200, data=output_filename)

    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=e)

    # fill_template("template_name", "json_name", "filled_file_name")


def fill_template(template_name, data, filled_file_name):
    # load template
    template = oxl.load_workbook(template_name)

    i = 0
    # go through all sheets
    for sheet in template.sheetnames:

        if i > 0 and sheet not in template:
            # create new sheet
            ws = template.create_sheet(index=i, title=sheet)
        else:
            ws = template[sheet]

        # fill sheet with data
        for cell in data[i][sheet]:
            cell_number = list(cell.keys())
            ws[cell_number[0]] = cell[cell_number[0]]

        i += 1

    template.save(filled_file_name)


def fill_simple_docx_template(template_name, data, filled_file_name):
    # open file
    document = docx.Document(template_name)

    # regex

    # paragraph input
    regex = re.compile("\$\{([a-zA-Z0-9]+)\}")
    for paragraph in document.paragraphs:
        while x := re.search(regex, paragraph.text):
            replace = x.string.split(" ")[-1]
            strip = replace[2:-1]
            if strip in data[0]:
                paragraph.text = paragraph.text.replace(replace, data[0][strip])

    # table input
    start_list_regex = re.compile("\$\{\#([a-zA-Z0-9]+)\}")
    list_regex = re.compile("\$\{([a-zA-Z0-9]+)\}")
    end_list_regex = re.compile("\$\{([a-zA-Z0-9]+)\#\}")
    for table in document.tables:
        for row in table.rows:
            # TODO
            # get correct list
            # get list length
            # create right amount of rows
            # fill rows with data

            # this probably isn't right
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    # replace list init
                    start_list_replace = re.search(start_list_regex, paragraph.text)
                    paragraph.text = paragraph.text.replace(start_list_replace, "")

                    # replace list element
                    replace = re.search(list_regex, paragraph.text)
                    paragraph.text = paragraph.text.replace(replace, data[0][replace[2:-1]])

                    # replace list end
                    end_list_replace = re.search(end_list_regex, paragraph.text)
                    paragraph.text = paragraph.text.replace(end_list_replace, "")


    document.save("../Templates/" + filled_file_name)


if __name__ == "__main__":
    print(os.path.dirname(os.path.realpath(__file__)))

    f = open("../Templates/1_template_simpleWord/input_simpleWord-Data.json")
    data = json.load(f)

    fill_simple_docx_template("../Templates/1_template_simpleWord/input_simpleWord-Template.docx", data,
                              "test-result.docx")
