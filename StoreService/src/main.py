import logging
from fastapi import FastAPI, UploadFile, File, Depends, Form
from fastapi.responses import JSONResponse
from botocore.exceptions import ClientError
from fastapi.middleware.cors import CORSMiddleware

from utils import create_response, get_client_s3, get_file_format_extension

# Logger
logging.basicConfig(
    format="%(module)-20s:%(levelname)-15s| %(message)s",
    level=logging.INFO
)

app = FastAPI()
bucket_name = "tdg-s3-bucket"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/1/files")
async def post_template(
    upload_file: UploadFile = File(...),
    filename: str = Form(),
    s3=Depends(get_client_s3)
) -> JSONResponse:
    """
    Endpoint ``/files`` that accepts the method POST. Receives a file and
    stores it in a bucket in AWS S3. Files are stored according to their
    extension.

    Parameters
    ----------
        upload_file : `UploadFile`
            The file provided in the POST request
        filename: `str`
            The name identifier of the file in the storage

    Returns
    -------
        response : `JSONResponse`
            Json response with the status code and data containing the message
            and data.
    """

    try:
        # checks for the extension of the file
        file_format, file_extension = get_file_format_extension(upload_file.filename)

        # file extension is not supported
        if not file_format or not file_extension:
            return create_response(status_code=400, message="File extension not supported.")

        # adds file extension to the file in case the user did not provide it
        if not filename.endswith(file_extension):
            filename += "." + file_extension

        # saves in the templates directory with the file format correct
        path = "template/" + file_format + "/" + filename

        s3.upload_fileobj(upload_file.file, bucket_name, path)
    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=str(e))

    return create_response(status_code=200, message="Success storing file: " + filename)


@app.delete("/api/1/files/{file_type}/{file_format}/{file_name}")
async def delete_file(
    file_type: str,
    file_format: str,
    file_name: str,
    s3=Depends(get_client_s3)
) -> JSONResponse:
    """
    Endpoint ``/delete`` that accepts the method POST. Receives a filepath and
    deletes it from the bucket in AWS S3.

    Parameters
    ----------
        file_type : `str`
            The type of the file (template or filled)
        file_format : `str`
            The format of the file (excel/word/powerpoint)
        file_name: `str`
            The name identifier of the file in the storage

    Returns
    -------
        response : `JSONResponse`
            Json response with the status code and data containing the message
            and data.
    """

    try:
        # deletes the file
        filepath = file_type + "/" + file_format + "/" + file_name
        s3.delete_object(Bucket=bucket_name, Key=filepath)

    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=str(e))

    return create_response(status_code=200, message="Success deleting file: " + filepath)
