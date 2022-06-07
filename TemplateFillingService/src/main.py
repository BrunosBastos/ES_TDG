from fastapi import FastAPI, UploadFile, File, Depends, Form
from fastapi.responses import JSONResponse
from pptx import Presentation
from botocore.exceptions import ClientError
import logging
import re
import json
import openpyxl as oxl

from utils import create_response, get_client_s3, get_file_extension, duplicate_slide

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
        retrieval_filename : `str`
            Location of the template file in the bucket
        output_filename : `str`
            The name of the resulting file

    Returns
    -------
        response : `JSONResponse`
            Json response with the status code and data containing the message
            and data.

    """
    try:

        _, t_format, t_filename = retrieval_filename.split("/")

        # load json data
        data = json.load(upload_file.file)

        s3.download_file(
            bucket_name, retrieval_filename, t_filename
        )

        file_extension = get_file_extension(t_filename, t_format)

        if not output_filename.endswith(file_extension):
            output_filename += "." + file_extension

        # fill excel template
        if file_extension == "xlsx":
            fill_excel_template(t_filename, data, output_filename)

        # fill pptx template
        elif file_extension == "pptx" or file_extension == "ppt":
            fill_ppt_template(t_filename, data, output_filename)

        # fill pptx template
        elif file_extension == "docx":
            fill_word_template(t_filename, data, output_filename)

        path = "filled/" + t_format + "/" + output_filename

        s3.upload_fileobj(
            open(output_filename, "rb"), bucket_name, path
        )

        return create_response(status_code=200, data=output_filename)

    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=e)


def fill_excel_template(template_name, data, filled_file_name):
    """
    Fills excel template with JSON data

    Parameters
    ----------
        template_name : `str`
            The name of the template file
        data : JSON
            The JSON data to be used in filling
        filled_file_name : `str`
            The name of the resulting file
    """

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
    """
    Fills powerpoint template with JSON data

    Parameters
    ----------
        template_name : `str`
            The name of the template file
        data : JSON
            The JSON data to be used in filling
        filled_file_name : `str`
            The name of the resulting file
    """

    # load template
    template = Presentation(template_name)

    [duplicate_slide(template, 0) for _ in range(1, len(data["records"]))]

    i = 0
    # go through data
    for slide_data in data["records"]:
        slide_shape = template.slides[i]
        for slide_t in slide_shape.shapes:
            slide_text = slide_t.text_frame
            for slide_paragraph in slide_text.paragraphs:
                whole_text = "".join([r.text for r in slide_paragraph.runs])
                data_params = re.findall(r"\{([A-Za-z0-9_]+)\}", whole_text)
                for d in data_params:
                    if d in slide_data.keys():
                        whole_text = whole_text.replace(f"{{{d}}}", slide_data[d])
                for idx, run in enumerate(slide_paragraph.runs):
                    if idx == 0:
                        continue
                    p = slide_paragraph._p
                    p.remove(run._r)
                slide_paragraph.runs[0].text = whole_text

        i += 1

    template.save(filled_file_name)
    return


def fill_word_template(template_name, data, filled_file_name):
    """
    Fills word template with JSON data

    Parameters
    ----------
        template_name : `str`
            The name of the template file
        data : JSON
            The JSON data to be used in filling
        filled_file_name : `str`
            The name of the resulting file
    """

    return
