import logging
from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from botocore.exceptions import ClientError

import json
import openpyxl as oxl

from utils import create_response, get_client_s3

# Logger
logging.basicConfig(
    format="%(module)-20s:%(levelname)-15s| %(message)s",
    level=logging.INFO
)

@app.post("/api/3/fill")
async def post_template(upload_file: UploadFile = File(...), s3 = Depends(get_client_s3)) -> JSONResponse:
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
    
    # TODO get template from s3 and save temporary

    # TODO save json temporary


    fill_template("template_name", "json_name", "filled_file_name")


def fill_template(template_name, json_name, filled_file_name):

    # load template 
    template = oxl.load_workbook(template_name)

    # load json data
    data = json.loads(open(json_name, "r").read())

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
