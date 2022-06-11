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
async def get_templates(file_type: str = '', s3=Depends(get_client_s3)) -> JSONResponse:
    """

    Endpoint ``/files`` that accepts the method GET. Returns information about
    the all the files (filenames, type, format, size).

    Returns
    -------
        response : `JSONResponse`
            Json response with the status code and data containing
            the message and data.
    """
    if file_type and file_type not in ('filled', 'template'):
        return create_response(status_code=400, message="Value of query parameter 'file_type' unrecognized.")
    try:
        if file_type:
            file_contents = s3.list_objects_v2(Bucket=bucket_name, Prefix=file_type + '/').get("Contents", [])
        else:
            file_contents = s3.list_objects_v2(Bucket=bucket_name, Prefix='template/').get("Contents", [])
            file_contents.extend(s3.list_objects_v2(Bucket=bucket_name, Prefix='filled/').get("Contents", []))

        response_data = []
        for f in file_contents:
            if len(f['Key'].split("/")) > 1:   # TODO: change this when all the file are deleted
                file_type, file_format, filename = f['Key'].split("/")
                response_data.append({'name': filename, 'type': file_type, 'format': file_format, 'size': f['Size']})

        return create_response(status_code=200, data=response_data)
    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=str(e))


@app.get("/api/2/files/{file_type}/{file_format}/{file_name}")
def download_template(
    file_type: str, file_format: str, file_name: str, s3=Depends(get_client_s3)
) -> Union[JSONResponse, FileResponse]:
    """
    Endpoint ``/files/{file_name}`` that accepts the method GET. Returns
    the template file requested.

    Parameters:
        file_type : `str`
            The type of the file (template/filled)
        file_format : `str`
            The format of the file (excel/word/powerpoint)
        file_name : `str`
            The name of the file

    Returns
    -------
        response : `JSONResponse` or `FileResponse`
            Json response with the status code and data containing the
            message and data.
    """
    try:
        path = file_type + "/" + file_format + "/" + file_name
        s3.download_file(bucket_name, path, 'temp')
        return FileResponse('temp', media_type='application/octet-stream',
                            filename=file_name)
    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=str(e))
