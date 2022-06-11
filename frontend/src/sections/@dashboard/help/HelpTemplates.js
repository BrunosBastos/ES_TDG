import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// material
import {
    Card,
    CardHeader,
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// components
import Searchbar from 'src/components/Searchbar';
// services
import FileService from 'src/services/FileService';
//
import { config } from 'src/consts';

const service = FileService.getInstance();

export default function HelpTemplates() {
    const [rows, setRows] = useState(null);
    const [selected, setSelected] = useState("");        // contains the path of the selected template
    const [file, setFile] = useState(null);
    const [filledFilename, setFilledFilename] = useState("");
    const [open, setOpen] = useState(false);
    const [openFill, setOpenFill] = useState(true);
    const [sortKey, setSortKey] = useState("name");
    const [sortOrder, setSortOrder] = useState(true);
    const [search, setSearch] = useState("");
    const [fileFormat, setFileFormat] = useState("");

    const handleClickOpen = (templateType, templateFormat, templateName, fill) => {
        setSelected(templateType + "/" + templateFormat + "/" + templateName);
        setOpenFill(fill);
        setOpen(true);
    };

    const handleClose = () => {
        setSelected("");
        setFile(null);
        setFilledFilename("");
        setOpen(false);
    };

    const handleUploadJson = (e) => {
        setFile(e.target.files[0]);
        toast.success("Selected file " + e.target.files[0].name);
    };

    useEffect(() => {
        service.getAllFiles()
            .then(res => res.json())
            .then(res => { setRows(res.data); })
            .catch(_ => setRows([]));
    }, [])

    /**
     * Takes the size of a file and converts it to the closest magnitude of measurament.
     * The units should be rounded to 1 decimal place.
     * @param {int} the size 
     */
    const convertSize = (size) => {
        if (size > 1000000)
            return Math.round(size / 100000) / 10 + " MB";
        else if (size > 1000)
            return Math.round(size / 100) / 10 + " KB";
        else
            return size + " B";
    };

    /**
     * The user selects a json file and a template that needs to be filled with data. 
     * A HTTP request is made to the backend and the results of the request are displayed to the user
     * as a toaster.
     * @returns void 
     */
    const uploadJsonData = () => {
        if (selected == "" || file == null || filledFilename == "")
            return;

        const formData = new FormData();
        formData.set('upload_file', file);
        formData.set('output_filename', filledFilename);
        formData.set('retrieval_filename', selected);
        service.uploadJsonData(formData)
            .then(res => res.json())
            .then(res => toast.success("Successfully filled the template."))
            .catch(error => toast.error(error));

        handleClose();
    };

    /**
     * The user confirms the deletion of a file.
     * A HTTP request is made to the backend and the results of the request are displayed to the user
     * as a toaster.
     * @returns void 
     */
    const deleteFile = () => {
        if (selected == "")
            return;

        service.deleteFile(selected)
            .then(res => res.json())
            .then(res => {
                toast.success("Successfully deleted file " + selected)    
                setRows(rows.filter((r) => 
                    r.type + "/" + r.format + "/" + r.name !== selected
                ))
            })
            .catch(error => toast.error(error));

        handleClose();
    };

    /**
     * Takes a string as input and returns the first letter as uppercase
     * @param {*} str   The string to be capitalize
     * @returns         The same string but the first letter is not uppercase
     */
    const capitalize = (str) => str[0].toUpperCase() + str.slice(1);


    /**
     * Returns true if the value is null, undefined or a empty string, and false otherwise.
     * For booleans, always returns false.
     * @param {v}   the value 
     */
    const isEmpty = (v) => typeof v !== "boolean" && !!!v;

    /**
     * Returns true if `substr` is included inside `str`. This method is case insensitive.
     * @param {substr}  the substring that we is seeked inside `str`
     * @param {str}     the string 
     */
    const isIncluded = (substr, str) => str.toLowerCase().includes(substr.toLowerCase());

    /** The sorted `rows` array according to `sortKey` and `sortOrder` */
    const filteredRows = rows && rows
        .filter((r) => (isEmpty(search) || isIncluded(search, r.name)) && (isEmpty(fileFormat) || fileFormat === r.format))
        .sort((a, b) => isEmpty(a[sortKey]) ? 1 : isEmpty(b[sortKey]) ? -1
            : (a[sortKey] > b[sortKey]) ? (-1) ** !sortOrder : (-1) ** sortOrder);

    const HeadCellSort = ({ align, cellKey, children }) => (
        <div style={{ display: 'flex', justifyContent: align, cursor: 'pointer', userSelect: 'none' }} onClick={() => {
            setSortKey(cellKey);
            setSortOrder(!sortOrder);
        }}>
            {children}
            <span style={{ width: '1em', height: '1em' }}>
                {sortKey === cellKey && (sortOrder ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />)}
            </span>
        </div>
    );
  
    const [name, setName] = useState("");

    return (
        <Card>
            <CardHeader title={"How to upload files?"} subheader={"Keep reading for a Tutorial"} />
            <Box sx={{ p: 3, pb: 1, display: "flex" }}>
            </Box>
        </Card>
    )
}
