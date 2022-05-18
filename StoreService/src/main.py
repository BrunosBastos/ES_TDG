import logging
import boto3
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

# Logger
logging.basicConfig(
    format="%(module)-20s:%(levelname)-15s| %(message)s",
    level=logging.INFO
)


app = FastAPI()

s3 = boto3.resource('s3')           # chooses s3 service from AWS



@app.post("/files")
async def post_template(upload_file: UploadFile = File(...)) -> JSONResponse:
    """
    Endpoint '/files' that accepts the method POST. Accepts a file and 
    stores it in a bucket in AWS S3.

    Args:

        upload_file (UploadFile): the file provided in the POST request
    
    Returns:

        response (JSONResponse): json response with the status code and data containing the message and data. 
    
    """
    file_str = await upload_file.read()
    logging.info(file_str)
    
    # s3.upload_fileobj(upload_file.filename, "bucketname", "key")


    return create_response(status_code=200, message="Success storing file.")



def create_response(status_code=200, message="", data=[]) -> JSONResponse:
    """
    Util function to send HTTP responses.

    Args:

        status_code (int): the status code of the response
        data (Obj): some data to return, usually the object that was created/deleted
        message (str): message to return in the response
    
    Returns:

        response (JSONResponse): json object with the aggregated response information
    
    """
    
    return JSONResponse(
        status_code=status_code,
        content={
            "message": message,
            "data": data,
        },
        headers={"Access-Control-Allow-Origin": "*"}
    )