import React from 'react';
import { Card, CardHeader, Box, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FileService from 'src/services/FileService';

const service = FileService.getInstance();

export default function ListTemplates() {

    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        service.getAllFiles()
            .then(res => res.json())
            .then(res => {console.log(res); setRows(res.data);})
            .catch(_ => setRows([]))

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
                                    <TableCell style={{width: "15%"}} align="right">Size</TableCell>
                                    <TableCell style={{width: "5%"}} align="left"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.Name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell style={{width: "80%"}} component="th" scope="row">
                                            {row.Name}
                                        </TableCell>
                                        <TableCell style={{width: "15%"}}  align="right">{convertSize(row.Size)}</TableCell>
                                        <TableCell style={{width: "5%"}}  align="left"></TableCell>

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
