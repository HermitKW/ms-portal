import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Search } from "@mui/icons-material";
import {map} from 'lodash';
import { Button } from '@mui/material';
import './CarpoCase.scss';


// interface DocumentClassMap {
//     id: any
//     type: any
//     size: any
//   }

// const [documentClassMaps, setDocumentClassMaps] = useState<DocumentClassMap[]>([]);

const records = [
    {"id": "1", "type": "Full Investigation Report","size":"10"}, 
    {"id": "2", "type": "Pol.155","size":"10"}, 
    {"id": "3", "type": "Pol.154 of Com(1)","size":"10"}, 
    {"id": "4", "type": "TRS Records dated 2022-10-10","size":"100"}, 
    {"id": "5", "type": "DVD disk by physical dispatch","size":""}, 
]

// const loadDocumentClassesMap = () => {
//     let flag = true;
//     if (flag) {
//         let documentClassMaps: DocumentClassMap[] = map(records, function (i) {
//           let documentClassMap: DocumentClassMap = {
//             id: i.id,
//             type: i.type,
//             size: i.size
//           }
//           return documentClassMap
//         });
//         console.log("documentClassMaps: " + documentClassMaps);
//         setDocumentClassMaps(documentClassMaps);
//       }
// }


export default function EnhancedTableToolbar() {
    return (
        <TableContainer component={Paper}>
            <TableHead>
                <TableCell style={{borderBottom:'none'}}>Case Detail</TableCell>
            </TableHead>
            <TableHead>
                <TableCell style={{borderBottom:'none'}}>CAPO RN:</TableCell>
            </TableHead>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow style={{backgroundColor:'#F1FAFE'}}>
                        <TableCell>
                        <input type='checkbox' style={{marginRight: '10px' }}/>
                            S/N.
                        </TableCell>
                        <TableCell>Type of Document</TableCell>
                        <TableCell>File Size(MB)</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        records.map((record,index) => (
                            <TableRow key={record.id}>
                                <TableCell component="th" scope="row">
                                {records.length - 1 !== index ? (
                                    <input type='checkbox' style={{marginRight: '10px' }}/>
                                ) : <input type='checkbox' style={{visibility: 'hidden',marginLeft: '11px'}}/>}  
                                    {record.id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {record.type}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {record.size}
                                </TableCell>
                                {records.length - 1 === index ? (
                                        <Button style={{left: '95px',color:'#FFFFFF',backgroundColor:'#094880',margin:'5px'}} variant="contained">
                                            Confirm receipt of physical file
                                        </Button> 
                                ) : <TableCell/>}  
                                
                            </TableRow>
                        ))}

                </TableBody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',margin:'10px'}}>
                
                <Button style={{padding:'10px, 24px, 10px, 24px',marginRight: '25px',marginLeft: '565px',color:'#FFFFFF',backgroundColor:'#094880'}} variant="contained">
                    Endorse CAPO Inverstigation
                </Button>
                
                <Button style={{width:'100px', marginRight: '35px',marginLeft: '20px',color:'#FFFFFF',backgroundColor:'#094880'}} variant="contained">
                    Query
                </Button>
                <Button style={{ marginRight: '25px',color:'#FFFFFF',backgroundColor:'#094880'}} variant="contained">
                    Download
                </Button>
            </div>
            
        </TableContainer>
    );
}