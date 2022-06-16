import boto3
from fastapi.responses import JSONResponse
import copy
import re
from bs4 import BeautifulSoup


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
    layout_items_count = [len(layout.placeholders)
                          for layout in pres.slide_layouts]
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


def delete_paragraph(paragraph):
    """
    Deletes a paragraph from a Word document

    Parameters
    ----------
        paragraph : `Paragraph`
            The paragraph to delete
    """
    p = paragraph._element
    p.getparent().remove(p)
    p._p = p._element = None


def insert_paragraph(document, index, text):
    """
    Inserts the paragraph at a given position

    Parameters
    ----------
        document : `Document`
            A word document object
        index : `int`
            The index where to insert the paragraph
        text : `str`
            The text of the new inserted paragraph
    """
    document.paragraphs[index].insert_paragraph_before(text)


def fill_paragraph(global_data, local_data, paragraph):
    """
    Fills the paragraph with the data provided

    Parameters
    ----------
        global_data : `dict`
            The global json data
        local_data : `Any`
            The local json data, comes from a list
        paragraph : `str`
            The paragraph text

    Returns
    -------
        text : `str`
            The resulting paragraph text
    """
    value_regex = re.compile(r"\$\{\w+}")
    list_value_regex = re.compile(r"\$\{\.\w+}")

    if x := re.search(value_regex, paragraph):
        replace = x.group(0)[2:-1]

        # it's just a string
        if isinstance(global_data[replace], str):
            paragraph = paragraph.replace(
                x.group(0), global_data[replace])

        # it's an object
        elif isinstance(global_data[replace], dict):
            # if type isn't html
            if global_data[replace]["type"] != "html":
                paragraph = paragraph.replace(
                    x.group(0), global_data[replace]["value"])

            # if type is html
            else:
                html = BeautifulSoup(
                    global_data[replace]["value"], "html.parser")
                paragraph = paragraph.replace(
                    x.group(0), html.prettify())

    if local_data:
        if x := re.search(list_value_regex, paragraph):
            replace = x.group(0)[3:-1]
            paragraph = paragraph.replace(
                x.group(0), local_data[replace])

    return paragraph
