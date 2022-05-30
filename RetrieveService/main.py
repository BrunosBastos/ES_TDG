import logging
import boto3
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


@app.get("/api/2/files")
async def get_templates(s3 = Depends(get_client_s3)) -> JSONResponse:
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
        s3_client = boto3.client("s3")
        bucket_name = "tdg-s3-bucket"
        files = s3_client.list_objects_v2(Bucket=bucket_name)["Contents"]
        final_files = [{'Name': f['Key'], 'Size': f['Size']} for f in files]
        print(final_files)
        return create_response(status_code=200, data=final_files)
    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=e)

