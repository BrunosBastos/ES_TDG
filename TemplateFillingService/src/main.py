import logging
from fastapi import FastAPI, UploadFile, File, Depends, Form
from fastapi.responses import JSONResponse
from botocore.exceptions import ClientError
import json
import openpyxl as oxl

from utils import create_response, get_client_s3, get_file_extension

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

        fill_template(t_filename, data, output_filename)

        path = "filled/" + t_format + "/" + output_filename

        s3.upload_fileobj(
            open(output_filename, "rb"), bucket_name, path
        )

        return create_response(status_code=200, data=output_filename)

    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=str(e))


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
