import logging
from fastapi import FastAPI, UploadFile, File, Depends, Form
from fastapi.responses import JSONResponse
from botocore.exceptions import ClientError
import boto3

import json
import openpyxl as oxl

from utils import create_response, get_client_s3


app = FastAPI()
bucket_name = "tdg-s3-bucket"


# Logger
logging.basicConfig(
    format="%(module)-20s:%(levelname)-15s| %(message)s",
    level=logging.INFO
)

@app.post("/api/3/fill")
async def post_template(upload_file: UploadFile = File(...), retrival_file: str = Form(), output_file: str = Form(), s3 = Depends(get_client_s3)) -> JSONResponse:
    """
    Endpoint ``/fill`` that accepts the method POST. Receives a JSON file and a template name.

    Parameters
    ----------
        upload_file : `UploadFile`
            The file provided in the POST request
    
    Returns
    -------
        response : `JSONResponse`
            Json response with the status code and data containing the message and data. 
    
    """
    try:
        # load json data
        data = json.load(upload_file.file)

        s3_client = boto3.client("s3")
        bucket_name = "tdg-s3-bucket"
        s3_client.download_file(bucket_name, retrival_file, retrival_file)

        fill_template(retrival_file, data, output_file)

        s3.upload_fileobj(open(output_file, "rb"), bucket_name, output_file)

        return create_response(status_code=200, data=output_file)

    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=e)

    # fill_template("template_name", "json_name", "filled_file_name")


def fill_template(template_name, data, filled_file_name):

    # load template 
    template = oxl.load_workbook(template_name)

    i=0
    # go through all sheets
    for sheet in template.sheetnames:
        
        if i>0 and sheet not in template:
            #create new sheet
            ws = template.create_sheet(index = i , title = sheet)
        else:
            ws = template[sheet]

        #fill sheet with data 
        for cell in data[i][sheet]:
            cell_number = list(cell.keys())
            ws[cell_number[0]] = cell[cell_number[0]]

        i+=1

    template.save(filled_file_name)
