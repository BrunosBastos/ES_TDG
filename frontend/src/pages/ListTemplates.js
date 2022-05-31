import React, { useState, useEffect } from 'react';
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
// services
import FileService from 'src/services/FileService';

const service = FileService.getInstance();

export default function ListTemplates() {
    const [rows, setRows] = useState(null);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        service.getAllFiles()
            .then(res => res.json())
            .then(res => { setRows(res.data); })
            .catch(_ => setRows([]));
    }, []);

    /**
     * Takes the size of a file and converts it to the closest magnitude of measurament.
     * The units should be rounded to 1 decimal place.
     * @param {int} size 
     */
    const convertSize = (size) => {
        if (size > 1000000)
            return Math.round(size / 100000) / 10 + " MB";
        else if (size > 1000)
            return Math.round(size / 100) / 10 + " KB";
        else
            return size + " B";
    }

    const uploadJsonData = (template, jsonData, filename) => {
        const formData = new FormData();
        formData.set('upload_file', jsonData);
        formData.set('output_file', filename);
        formData.set('retrieval_file', template);
        service.uploadJsonData(formData)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(_ => console.log("error"));
    }


    return (
        <>
            <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We
                            will send updates occasionally.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleClose}>Subscribe</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Card>
                <CardHeader title={"List Files"} subheader={"See your files"} />
                <Box sx={{ p: 3, pb: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }} dir="ltr">
                    {rows === null ?
                        <CircularProgress />
                        :
                        rows?.length === 0 ?
                            <h2 style={{ color: "#637381" }}>Your files storage is empty.</h2>
                            :
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ width: "80%" }} align="left">Name</TableCell>
                                            <TableCell style={{ width: "15%" }} align="right">Size</TableCell>
                                            <TableCell style={{ width: "5%" }} align="left">
                                                <Button variant="outlined" onClick={handleClickOpen}>
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.Name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell style={{ width: "80%" }} component="th" scope="row">
                                                    {row.Name}
                                                </TableCell>
                                                <TableCell style={{ width: "15%" }} align="right">{convertSize(row.Size)}</TableCell>
                                                <TableCell style={{ width: "5%" }} align="left" >Fill</TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                    }
                </Box>
            </Card>
        </>
    )
}
