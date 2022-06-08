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

export default function ListTemplates() {
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

    return (
        <Card>
            <CardHeader title={"List Files"} subheader={"See your templates"} />
            <Box sx={{ p: 3, pb: 1, display: "flex" }}>
                <Searchbar placeholder='Search template...' handleSearch={setSearch} />

                <FormControl sx={{ m: 1, minWidth: 180 }}>
                    <InputLabel id="select-template-format">File Format</InputLabel>
                    <Select
                        labelId="select-template-format"
                        id="select-template-format"
                        value={fileFormat}
                        label="File Format"
                        onChange={(e) => setFileFormat(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"excel"}>Excel</MenuItem>
                        <MenuItem value={"word"}>Word</MenuItem>
                        <MenuItem value={"powerpoint"}>PowerPoint</MenuItem>
                    </Select>
                </FormControl>

            </Box>
            <Box sx={{ p: 3, pb: 1, minHeight: 250, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }} dir="ltr">
                {rows === null ?
                    <CircularProgress />
                    :
                    filteredRows?.length === 0 ?
                        <h2 style={{ color: "#637381", alignSelf: "center" }}>
                            {rows?.length === 0 ? "Your files storage is empty." : "No results found."}
                        </h2>
                        :
                        <TableContainer component={Paper}>
                            <Table stickyHeader sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "50%" }} align="left">
                                            <HeadCellSort cellKey={'name'}>Name</HeadCellSort>
                                        </TableCell>
                                        <TableCell style={{ width: "10%" }} align="left">
                                            <HeadCellSort cellKey={'type'}>Type</HeadCellSort>
                                        </TableCell>
                                        <TableCell style={{ width: "10%" }} align="left">
                                            <HeadCellSort cellKey={'format'}>Format</HeadCellSort>
                                        </TableCell>
                                        <TableCell style={{ width: "15%" }} align="right">
                                            <HeadCellSort cellKey={'size'} align="right">Size</HeadCellSort>
                                        </TableCell>
                                        <TableCell style={{ width: "5%" }} align="left" />
                                        <TableCell style={{ width: "5%" }} align="left" />
                                        <TableCell style={{ width: "5%" }} align="left" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell style={{ width: "50%" }} component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell style={{ width: "10%" }} component="th" scope="row">
                                                {capitalize(row.type)}
                                            </TableCell>
                                            <TableCell style={{ width: "10%" }} component="th" scope="row">
                                                {capitalize(row.format)}
                                            </TableCell>
                                            <TableCell style={{ width: "15%" }} align="right">{convertSize(row.size)}</TableCell>
                                            <TableCell style={{ width: "5%" }} align="left" >
                                                {row.type === "template" && <Button variant="outlined" onClick={() => { handleClickOpen("template", row.format, row.name, true) }}>
                                                    Fill
                                                </Button>}
                                            </TableCell>
                                            <TableCell style={{ width: "5%" }} align="left" >
                                                <Button variant="outlined" href={config.API_URL + "/2/files/" + row.type + "/" + row.format + "/" + row.name}>
                                                    <DownloadIcon />
                                                </Button>
                                            </TableCell>
                                            <TableCell style={{ width: "5%" }} align="left" >
                                                <Button variant="outlined" color="error" onClick={() => { handleClickOpen(row.type, row.format, row.name, false) }}>
                                                    <DeleteIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
            </Box>
            <Dialog open={open} onClose={handleClose}>
                {openFill ?
                    <>
                        <DialogTitle>Upload Json Data</DialogTitle>
                        <DialogContent style={{ textAlign: "center" }}>
                            <DialogContentText>
                                Import your data to fill the selected template.
                            </DialogContentText>
                            <div style={{ display: "flex", alignItems: "flex-end" }}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Filename"
                                    type="text"
                                    variant="standard"
                                    onChange={(e) => setFilledFilename(e.target.value)}
                                />
                                <div style={{ margin: 10 }}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                    >
                                        Upload File
                                        <input
                                            onChange={handleUploadJson}
                                            type="file"
                                            hidden
                                        />
                                    </Button>
                                </div>
                            </div>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button color="primary" variant="contained" onClick={uploadJsonData}>Upload Data</Button>
                        </DialogActions>
                    </>
                    :
                    <>
                        <DialogTitle>Delete File</DialogTitle>
                        <DialogContent style={{ textAlign: "center" }}>
                            <DialogContentText>
                                Are you sure you want to delete this file?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button color="error" variant="contained" onClick={deleteFile}>Delete</Button>
                        </DialogActions>
                    </>}
            </Dialog>

        </Card>
    )
}
