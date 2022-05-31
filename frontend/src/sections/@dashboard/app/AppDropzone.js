import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Card, CardHeader, Box, Button } from '@mui/material';

import FileService from '../../../services/FileService';

const service = FileService.getInstance();

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    maxWidth: 800,
    height: 200,
    margin: 'auto',
    justifyContent: 'center'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const maxSize = 10000000;
const acceptedWordExt = ['doc', 'docm', 'docx', 'docx', 'dot', 'dotm', 'dotx'];
const acceptedExcelExt = ['csv', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx', 'xlw', 'xml', 'xps'];
const acceptedPowerPointExt = ['pot', 'potm', 'potx', 'ppa', 'ppam', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx'];


function fileValidator(file) {
    console.log(file)
    const ext = file.name.split('.').pop();
    if (![...acceptedWordExt, ...acceptedExcelExt, ...acceptedPowerPointExt].includes(ext)) {
        return {
            code: "wrong-extension",
            message: `File extension not accepted`
        };
    }
    if (file.size > maxSize) {
        return {
            code: "too-large",
            message: `File size is larger than ${maxSize / 1000000} Mb`
        };
    }

    return null;
}

export default function Dropzone({ title, subheader, other }) {
    const [response, setResponse] = useState("");

    const {
        acceptedFiles,
        fileRejections,
        isFocused,
        isDragAccept,
        isDragReject,
        getRootProps,
        getInputProps,
    } = useDropzone({
        validator: fileValidator
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    const onSubmit = () => {
        if (acceptedFiles.length == 0) {
            return;
        }

        const formData = new FormData();
        formData.set('upload_file', acceptedFiles[0]);

        service.uploadFile(formData)
            .then(res => res.json())
            .then(res => setResponse(res.message))
            .catch(_ => setResponse("Error uploading file"))
    }

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />

            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <section className="container">
                    <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                        <em>(Only DOC, CSV, PPT files and similar extensions will be accepted)</em>
                    </div>
                    <aside>
                        <h4>Accepted files</h4>
                        <ul>{acceptedFileItems}</ul>
                        <h4>Rejected files</h4>
                        <ul>{fileRejectionItems}</ul>
                    </aside>
                    <Button onClick={onSubmit} variant="contained" disabled={acceptedFiles.length === 0}>
                        Upload
                    </Button>
                    {response}
                </section>

            </Box>

        </Card>
    );
}