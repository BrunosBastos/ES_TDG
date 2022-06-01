import React, { useMemo, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
// material
import { Card, CardHeader, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// services
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
    const ext = file.name.split('.').pop();
    let message;
    if (![...acceptedWordExt, ...acceptedExcelExt, ...acceptedPowerPointExt].includes(ext)) {
        message = `The file extension .${ext} is not allowed`;
        toast.error(message);
        return {
            code: "wrong-extension",
            message
        };
    }
    if (file.size > maxSize) {
        message = `The file size cannot be larger than ${maxSize / 1000000} MB`;
        toast.error(message);
        return {
            code: "too-large",
            message
        };
    }
    return null;
}

export default function Dropzone({ title, subheader, other }) {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        setFiles([...files, ...acceptedFiles])
    }, [files])

    const {
        isFocused,
        isDragAccept,
        isDragReject,
        getRootProps,
        getInputProps,
    } = useDropzone({
        validator: fileValidator,
        onDrop,
        disabled: loading,
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

    const handleResponse = (success, message) => {
        if (success)
            toast.success(message);
        else
            toast.error(message);
        setLoading(false);
        setFiles([]);
    }

    const submissionIsValid = () => {
        return files.length === 1;
    }

    const onSubmit = () => {
        if (!submissionIsValid()) {
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.set('upload_file', files[0]);

        service.uploadFile(formData)
            .then(res => res.json())
            .then(res => handleResponse(true, res?.message))
            .catch(_ => handleResponse(false, "An error occurred on the file submission"));
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
                    <br />
                    <aside>
                        {files?.map(file => (
                            <div key={file.path}>
                                {file.path} - {file.size} bytes
                            </div>
                        ))}
                    </aside>
                    <br />
                    <LoadingButton variant="contained"
                        onClick={onSubmit}
                        disabled={loading || !submissionIsValid()}
                        loading={loading}>
                        Upload
                    </LoadingButton>
                </section>
            </Box>
        </Card>
    );
}