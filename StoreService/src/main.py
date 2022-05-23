import logging
from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from botocore.exceptions import ClientError

from utils import create_response, get_client_s3

# Logger
logging.basicConfig(
    format="%(module)-20s:%(levelname)-15s| %(message)s",
    level=logging.INFO
)

app = FastAPI()
bucket_name = "tdg-s3-bucket"


# s3 = boto3.client('s3')           # chooses s3 service from AWS
# s3.download_file("tdg-s3-bucket", 'nome do bucket', "nome do ficheiro para guardar")


@app.post("/files")
async def post_template(upload_file: UploadFile = File(...), s3 = Depends(get_client_s3)) -> JSONResponse:
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
        return create_response(status_code=400, message=e)

    return create_response(status_code=200, message="Success storing file.")
