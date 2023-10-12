import React from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const TotalsTable = (props) => {
    
    const { totals, fontSize } = props;

    return (
        <div>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="left"  sx = {{fontSize: fontSize}}>Calories</TableCell>
                        <TableCell align="left"  sx = {{fontSize: fontSize}}>Fat</TableCell>
                        <TableCell align="left"  sx = {{fontSize: fontSize}}>Carbs</TableCell>
                        <TableCell align="left"  sx = {{fontSize: fontSize}}>Protein</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align="left"  sx = {{fontSize: fontSize, whiteSpace: "nowrap"}}>{parseFloat((totals.calories).toFixed(2))}</TableCell>
                        <TableCell align="left"  sx = {{fontSize: fontSize, whiteSpace: "nowrap"}}>{parseFloat((totals.fat).toFixed(2))} g</TableCell>
                        <TableCell align="left"  sx = {{fontSize: fontSize, whiteSpace: "nowrap"}}>{parseFloat((totals.carbs).toFixed(2))} g</TableCell>
                        <TableCell align="left"  sx = {{fontSize: fontSize, whiteSpace: "nowrap"}}>{parseFloat((totals.protein).toFixed(2))} g</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default TotalsTable;