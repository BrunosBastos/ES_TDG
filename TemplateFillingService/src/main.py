from fastapi import FastAPI, UploadFile, File, Depends, Form
from fastapi.responses import JSONResponse
from pptx import Presentation
from botocore.exceptions import ClientError

import six 
import copy
import logging
import boto3
import re
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
        """
        s3_client = boto3.client("s3")
        bucket_name = "tdg-s3-bucket"
        s3_client.download_file(
            bucket_name, retrieval_filename, retrieval_filename
        )
        """
        # fill excel template
        if ".xlsx" == retrieval_filename[-5:]:
            fill_excel_template(retrieval_filename, data, output_filename)
        
        # fill pptx template
        elif ".pptx" == retrieval_filename[-5:]:
            fill_ppt_template(retrieval_filename, data, output_filename)

        # fill pptx template
        elif ".docx" == retrieval_filename[-5:]:
            fill_word_template(retrieval_filename, data, output_filename)

        else:
           return create_response(status_code=400, message="Invalid extension for template") 

        """
        s3.upload_fileobj(
            open(output_filename, "rb"), bucket_name, output_filename
        )
        """
        return create_response(status_code=200, data=output_filename)

    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=e)

def fill_excel_template(template_name, data, filled_file_name):

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


def fill_ppt_template(template_name, data, filled_file_name):

    # load template
    template = Presentation(template_name)

    [duplicate_slide(template,0) for _ in range(1, len(data["records"]))]

    i=0
    # go through data
    for slide_data in data["records"]:
        slide_shape =template.slides[i]
        for slide_t in slide_shape.shapes:
            slide_text = slide_t.text_frame
            data_params = re.findall(r"\{([A-Za-z0-9_]+)\}", slide_text.text)
            for d in data_params:
                if d in slide_data.keys():
                    slide_text.text = slide_text.text.replace(f"{{{d}}}",slide_data[d]) 
                    print(slide_text.text)
        i+=1

    template.save(filled_file_name)
    return


def fill_word_template(template_name, data, filled_file_name):
    return


def _get_blank_slide_layout(pres):
    layout_items_count = [len(layout.placeholders) for layout in pres.slide_layouts]
    min_items = min(layout_items_count)
    blank_layout_id = layout_items_count.index(min_items)
    return pres.slide_layouts[blank_layout_id]

def duplicate_slide(pres, index):
    """Duplicate the slide with the given index in pres.

    Adds slide to the end of the presentation"""
    source = pres.slides[index]

    blank_slide_layout = _get_blank_slide_layout(pres)
    dest = pres.slides.add_slide(blank_slide_layout)

    for shp in source.shapes:
        el = shp.element
        newel = copy.deepcopy(el)
        dest.shapes._spTree.insert_element_before(newel, 'p:extLst')


    return dest