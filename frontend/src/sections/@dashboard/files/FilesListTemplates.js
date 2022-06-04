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
import DownloadIcon from '@mui/icons-material/Download';
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
    const [selected, setSelected] = useState("");        // contains the name of the selected template
    const [file, setFile] = useState(null);
    const [filledFilename, setFilledFilename] = useState("");
    const [open, setOpen] = useState(false);
    const [sortKey, setSortKey] = useState("Name");
    const [sortOrder, setSortOrder] = useState(true);

    const handleClickOpen = (templateName) => {
        setSelected(templateName);
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
     * Returns true if the value is null, undefined or a empty string, and false otherwise.
     * For booleans, always returns false.
     * @param {v} the value 
     */
    const isEmpty = (v) => typeof v !== "boolean" && !!!v;

    /** The sorted `rows` array according to `sortKey` and `sortOrder` */
    const sortedRows = rows && rows.sort((a, b) => isEmpty(a[sortKey]) ? 1 : isEmpty(b[sortKey]) ? -1
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
    )

    return (
        <Card>
            <CardHeader title={"List Files"} subheader={"See your templates"} />
            <Box sx={{ p: 3, pb: 1 }}>
                <Searchbar placeholder='Search template' handleSearch={() => {}} />
            </Box>
            <Box sx={{ p: 3, pb: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }} dir="ltr">
                {rows === null ?
                    <CircularProgress />
                    :
                    rows?.length === 0 ?
                        <h2 style={{ color: "#637381" }}>Your files storage is empty.</h2>
                        :
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "75%" }} align="left">
                                            <HeadCellSort cellKey={'Name'}>Name</HeadCellSort>
                                        </TableCell>
                                        <TableCell style={{ width: "15%" }} align="right">
                                            <HeadCellSort cellKey={'Size'} align="right">Size</HeadCellSort>
                                        </TableCell>
                                        <TableCell style={{ width: "5%" }} align="left" />
                                        <TableCell style={{ width: "5%" }} align="left" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedRows.map((row) => (
                                        <TableRow
                                            key={row.Name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell style={{ width: "75%" }} component="th" scope="row">
                                                {row.Name}
                                            </TableCell>
                                            <TableCell style={{ width: "15%" }} align="right">{convertSize(row.Size)}</TableCell>
                                            <TableCell style={{ width: "5%" }} align="left" >
                                                <Button variant="outlined" onClick={() => { handleClickOpen(row.Name) }}>
                                                    Fill
                                                </Button>
                                            </TableCell>
                                            <TableCell style={{ width: "5%" }} align="left" >
                                                <Button variant="outlined" href={config.API_URL + "/2/files/" + row.Name}>
                                                    <DownloadIcon />
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
            </Dialog>
        </Card>
    )
}
