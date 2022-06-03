import logging
from fastapi import FastAPI, UploadFile, File, Depends, Form
from fastapi.responses import JSONResponse
from botocore.exceptions import ClientError
import boto3

from bs4 import BeautifulSoup
import openpyxl as oxl
import json
import re


from utils import create_response, get_client_s3

# TODO: remove this import after done
import os
import docx
import xml.etree.ElementTree as ET
import zipfile

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

    Returns
    -------
        response : `JSONResponse`
            Json response with the status code and data containing the message
            and data.

    """
    try:
        # load json data
        data = json.load(upload_file.file)

        s3_client = boto3.client("s3")
        bucket_name = "tdg-s3-bucket"
        s3_client.download_file(
            bucket_name, retrieval_filename, retrieval_filename
        )

        fill_template(retrieval_filename, data, output_filename)

        s3.upload_fileobj(
            open(output_filename, "rb"), bucket_name, output_filename
        )

        return create_response(status_code=200, data=output_filename)

    except ClientError as e:
        logging.debug(e)
        return create_response(status_code=400, message=e)

    # fill_template("template_name", "json_name", "filled_file_name")


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

#
# def fill_simple_docx_template(template_name, data, filled_file_name):
#     # open file
#     document = docx.Document(template_name)
#
#     # paragraph input
#     page = 1                                    # page counter
#     regex = re.compile("\$\{([a-zA-Z0-9]+)\}")  # regex for identifying fillable stuff
#     for paragraph in document.paragraphs:
#         while x := re.search(regex, paragraph.text):
#             replace = x.string.split(" ")[-1]
#             strip = replace[2:-1]
#             if strip in data[0]:
#                 paragraph.text = paragraph.text.replace(replace, data[page - 1][strip])
#         for run in paragraph.runs:
#             if ('lastRenderedPageBreak' in run._element.xml) or ('w:br' in run._element.xml and 'type="page"' in run._element.xml):
#                 page += 1
#
#     document.save("../Templates/" + filled_file_name)
#
#     # get info from json
#     page_amount = len(data)
#
#
#
#
#     # table input 2
#     tree = ET.parse('country_data.xml')
#     root = tree.getroot()
#     for body in root.findall("<w:body>"):
#         for table in body.findall("<w:tbl>"):
#             for row in table.findall("<w:tr>"):
#                 for column in row.findall("<w:tc>"):
#                     for paragraph in column.findall("<w:p>"):
#                         for run in paragraph.findall("<w:r>"):
#                             for text in run.findall("<w:t>"):
#                                 text.text
#     for table in root.iter("<w:tbl>"):
#         for row in table.iter("<w:tr>"):
#             for column in row.iter("<w:tc>"):
#
#
#
#     # table input
#     with zipfile.ZipFile("../Templates/" + filled_file_name, "a") as file:
#         with open("word/document.xml", "a") as xml_file:
#             lines = xml_file.readlines()
#             page_counter = 1
#
#             start_list_regex = re.compile("\$\{\#([a-zA-Z0-9]+)\}")
#             list_regex = re.compile("\$\{([a-zA-Z0-9]+)\}")
#             end_list_regex = re.compile("\$\{([a-zA-Z0-9]+)\#\}")
#
#             # flags
#             in_table = False
#             in_row = False
#             in_column = False
#
#             table_theme = None
#
#             for idx, line in enumerate(lines):
#                 if "<w:br>" in line:
#                     page_counter += 1
#
#                 if "<w:tbl>" in line:
#                     in_table = True if not in_table else False
#
#                 if "<w:tr>" in line:
#                     in_row = True if not in_row else False
#
#                 if "<w:tc>" in line:
#                     in_column = True if not in_column else False
#
#                 if in_table and in_row and in_column:
#                     if "<w:t>" in line:
#                         if start_list_replace is None:
#                             start_list_replace = re.search(start_list_regex, line)
#                             if start_list_replace is not None:
#                                 table_theme = data[page_counter-1][start_list_replace[2:-1]]
#
#                             if start_list_replace is not None:
#                                 line.replace(start_list_replace, data[page_counter][start_list_replace[2:-1]])
#                                 end_list_replace = re.search(end_list_regex, line)
#
#                 while start_list_replace is not None:
#
#
#                 start_list_replace = re.search(start_list_regex, line)
#
#         # tree = xml.etree.ElementTree.XML(file.read('word/document.xml'))
#
#         page_counter = 1
#
#         for element in tree.iter():
#             if element.tag == "br":
#                 page_counter += 1
#                 print(f"PAGE: {page_counter}")
#             if element.text is not None:
#                 print(element.text)
#                 if ('lastRenderedPageBreak' in element.text) or ('w:br' in element.text and 'type="page"' in element.text):
#                     print("\n\n\n\n\n" + str(page_counter))
#
#     # for table in tree.iter(TABLE):
#     #     for row in table.iter(ROW):
#     #         for cell in row.iter(CELL):
#     #             print(''.join(node.text for node in cell.iter(TEXT)))
#
#     # table input
#     # start_list_regex = re.compile("\$\{\#([a-zA-Z0-9]+)\}")
#     # list_regex = re.compile("\$\{([a-zA-Z0-9]+)\}")
#     # end_list_regex = re.compile("\$\{([a-zA-Z0-9]+)\#\}")
#     # for table in document.tables:
#     #     for row in table.rows:
#     #         for cell in row.cells:
#     #             for paragraph in cell.paragraphs:
#     #                 in_row = True
#     #                 # replace list init
#     #                 start_list_replace = re.search(start_list_regex, paragraph.text)
#     #                 if start_list_replace:
#     #
#     #                     paragraph.text = paragraph.text.replace(start_list_replace, "")
#     #                     row_amount = 1
#     #                     total_row_amount = len(data[0][start_list_replace])
#     #
#     #                 # replace list element
#     #                 try:
#     #                     replace = re.search(list_regex, paragraph.text)
#     #                     paragraph.text = paragraph.text.replace(replace, data[0][start_list_replace][replace[2:-1]])
#     #                 except:
#     #                     print("\n")
#     #
#     #                 # replace list end
#     #                 try:
#     #                     end_list_replace = re.search(end_list_regex, paragraph.text)
#     #                     paragraph.text = paragraph.text.replace(end_list_replace, "")
#     #                 except:
#     #                     print("\n")


def fill_html_docx_template(template_name, data, filled_file_name):
    # open file
    document = docx.Document(template_name)

    # regex
    regex = re.compile("\{\w+}*")

    # iterate through paragraphs in document
    for paragraph in document.paragraphs:

        # if regex found element to substitute
        replace = re.search(regex, paragraph.text)
        if replace is not None:
            if data[replace.string[1:-1]]["type"] == "html":    # element is html
                html = BeautifulSoup(data[replace.string[1:-1]]["value"], parser="lxml")
                paragraph.text = paragraph.text.replace(replace.string, html.prettify())
            else:                                               # element isn't html
                paragraph.text = paragraph.text.replace(replace.string, data[replace.string[1:-1]]["value"])

    document.save("../Templates/2_template_HTML/" + filled_file_name)


if __name__ == "__main__":
    print(os.path.dirname(os.path.realpath(__file__)))

    f = open("../Templates/2_template_HTML/input_htmlWord-Data.json")
    data = json.load(f)

    fill_html_docx_template("../Templates/2_template_HTML/input_htmlWord-template.docx", data, "docx_html_test.docx")
