import React, { useState, useEffect } from 'react';
// material
import { Card, CardHeader, Box, Button } from '@mui/material';
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

    useEffect(() => {
        service.getAllFiles()
            .then(res => res.json())
            .then(res => { console.log(res); setRows(res.data); })
            .catch(_ => setRows([]));
    }, []);

    return (
        <Card>
            <CardHeader title={"List Files"} subheader={"See your files"} />
            <Box sx={{ p: 3, pb: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }} dir="ltr">
                {rows === null ?
                    <CircularProgress />
                    :
                    rows?.length === 0 ?
                        <h2 style={{color: "#637381"}}>Your files storage is empty.</h2>
                        :
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "80%" }} align="left">Name</TableCell>
                                        <TableCell style={{ width: "15%" }} align="right">Size</TableCell>
                                        <TableCell style={{ width: "5%" }} align="left"></TableCell>
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
                                            <TableCell style={{ width: "15%" }} align="right">{row.Size}</TableCell>
                                            <TableCell style={{ width: "5%" }} align="left"></TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
            </Box>
        </Card>
    )
}
