import logging
import boto3
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from botocore.exceptions import ClientError

# Logger
logging.basicConfig(
    format="%(module)-20s:%(levelname)-15s| %(message)s",
    level=logging.INFO
)

app = FastAPI()

s3 = boto3.client('s3')           # chooses s3 service from AWS

bucket_name = "tdg-s3-bucket"


# s3.download_file("tdg-s3-bucket", 'nome do bucket', "nome do ficheiro para guardar")

@app.post("/files")
async def post_template(upload_file: UploadFile = File(...)) -> JSONResponse:
    """
    Endpoint ``/files`` that accepts the method POST. Receives a file and 
    stores it in a bucket in AWS S3.

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
        s3.upload_fileobj(upload_file.file, bucket_name, upload_file.filename)
    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message="Could not upload files")

    return create_response(status_code=200, message="Success storing file.")



def create_response(status_code=200, message="", data=[]) -> JSONResponse:
    """
    Util function to send HTTP responses.

    Parameters
    ----------
        status_code : `int`
            The status code of the response
        data : `Any` 
            Some data to return, usually the object that was created/deleted
        message : `str` 
            Message to return in the response
    
    Returns
    -------
        response : `JSONResponse`
            Json object with the aggregated response information
    
    """
    
    return JSONResponse(
        status_code=status_code,
        content={
            "message": message,
            "data": data,
        },
        headers={"Access-Control-Allow-Origin": "*"}
    )