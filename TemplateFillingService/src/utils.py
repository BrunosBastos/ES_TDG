import boto3
from fastapi.responses import JSONResponse
import copy


def get_client_s3() -> boto3.client:
    """
    Creates a boto3 client. This function can be used as dependency injection
    in order to obtain the client to perform the required actions.

    Returns
    -------
        client: `boto3.client`
            AWS S3 client
    """
    return boto3.client('s3')           # chooses s3 service from AWS


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


def get_file_extension(filename, format) -> str:
    """
    Validates the extension of a given file and obtains the extension.

    Parameters
    ----------
        filename : `str`
            The name of the file

    Returns
    -------
        file_extension: `str`
            The extension of the file
    """
    accepted_file_formats = {
        "excel": ["xlsx"],
        "word": ["docx"],
        "powerpoint": ["ppt", "pptx"]
    }

    # checks for the file format (word/excel/powerpoint) and the corresponding file extension
    for extension in accepted_file_formats[format]:
        if filename.endswith(extension):
            return extension


def _get_blank_slide_layout(pres):
    """
    Aux function for duplicating slide
    Gets the blank layout of a presentation
    Parameters
    ----------
        pres : pptx.Presentation
            The presentation to be copied

    Returns
    -------
        SlideLayout
            The presentation blank layout
    """
    layout_items_count = [len(layout.placeholders) for layout in pres.slide_layouts]
    min_items = min(layout_items_count)
    blank_layout_id = layout_items_count.index(min_items)

    return pres.slide_layouts[blank_layout_id]


def duplicate_slide(pres, index):
    """
    Duplicate the slide with the given index in pres.
    Adds slide to the end of the presentation
    Parameters
    ----------
        pres : pptx.Presentation
            The presentation to be copied
        index : int
            The index of the slide to be duplicated
    Returns
    -------
        dest : pptx.Presentation
            The new presentation with the duplicated slide
    """
    """"""
    source = pres.slides[index]

    blank_slide_layout = _get_blank_slide_layout(pres)
    dest = pres.slides.add_slide(blank_slide_layout)

    for shp in source.shapes:
        el = shp.element
        newel = copy.deepcopy(el)
        dest.shapes._spTree.insert_element_before(newel, 'p:extLst')

    return dest
