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

    const requestSort = event => {
        const sortDir = direction === 'descending' ? 'ascending' : 'descending'
        setDirection(sortDir)
        setSortBy(event.target.id)
        const sortConfig = { sortBy: event.target.id, direction: sortDir }
        setSortedItems(sortTableData(things, sortConfig))
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
                                    <TableCell style={{width: "80%"}} align="left">
                                    <button
                                        type="button"
                                        onClick={() => requestSort('name')}
                                        className={getClassNamesFor('name')}
                                    >
                                        Name
                                    </button>
                                    </TableCell>
                                    <TableCell style={{width: "15%"}} align="right">
                                    <button
                                        type="button"
                                        onClick={() => requestSort('size')}
                                        className={getClassNamesFor('size')}
                                    >
                                        Size
                                    </button>
                                    </TableCell>
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
                                        <TableCell style={{width: "15%"}}  align="right">{row.Size}</TableCell>
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
