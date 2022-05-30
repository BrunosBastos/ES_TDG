import React from 'react';
import { Card, CardHeader, Box, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



const rows = [
    { "name": "file", "size": 1000 },
    { "name": "file2", "size": 100000 },
];



export default function ListTemplates() {
    return (
        <Card>
            <CardHeader title={"List Files"} subheader={"See your files"} />
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                {rows.length != 0 ?
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width: "80%"}} align="left">Name</TableCell>
                                    <TableCell style={{width: "20%"}} align="left">Size</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell style={{width: "80%"}} component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell style={{width: "20%"}}  align="left">{row.size}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                : <h1>No results found!</h1>}
            </Box>

        </Card>
    )
}
