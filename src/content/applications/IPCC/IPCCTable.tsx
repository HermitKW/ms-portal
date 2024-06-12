import { useState,useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function IpccTable() {

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Task Subject</TableCell>
                        <TableCell align="right">CAPO RN</TableCell>
                        <TableCell align="right">CAPO Team</TableCell>
                        <TableCell align="right">Received Data/Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
{/*                     {
                    records.map((record) => (
                        <TableRow
                            key={record.id}>
                            <TableCell component="th" scope="row">
                                {record.id}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {record.caporn}
                            </TableCell>
                            <TableCell align="right">{record.capoteam}</TableCell>
                            <TableCell align="right">{record.receivedData}</TableCell>
                        </TableRow>
                    ))}
 */}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default IpccTable;