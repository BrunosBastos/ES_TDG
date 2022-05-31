import logging
from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse, FileResponse
from botocore.exceptions import ClientError
from typing import Union
from utils import create_response, get_client_s3

# Logger
logging.basicConfig(
    format="%(module)-20s:%(levelname)-15s| %(message)s",
    level=logging.INFO
)

app = FastAPI()

bucket_name = "tdg-s3-bucket"


@app.get("/api/2/files")
async def get_templates(s3=Depends(get_client_s3)) -> JSONResponse:
    """
    Endpoint ``/files`` that accepts the method GET. Returns all the 
    file names and sizes

    Returns
    -------
        response : `JSONResponse`
            Json response with the status code and data containing
            the message and data. 
    """
    try:
        files = s3.list_objects_v2(Bucket=bucket_name)["Contents"]
        final_files = [{'Name': f['Key'], 'Size': f['Size']} for f in files]
        return create_response(status_code=200, data=final_files)
    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=str(e))


@app.get("/api/2/files/{file_name}")
def download_template(file_name: str, s3=Depends(get_client_s3)
                      ) -> Union[JSONResponse, FileResponse]:
    """
    Endpoint ``/files/{file_name}`` that accepts the method GET. Returns
    the template file requested.

    Returns
    -------
        response : `JSONResponse` or `FileResponse`
            Json response with the status code and data containing the 
            message and data. 
    """
    try:
        s3.download_file(bucket_name, file_name, 'temp')
        return FileResponse('temp', media_type='application/octet-stream',
                            filename=file_name)
    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=str(e))

