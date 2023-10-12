import React, {useState} from "react";


//MaterialUI
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import "../../stylesheets/searchFoodItemResults.css"

const SearchResult = (props) => {
    const { result, media700W, media500W } = props;
    const selectFood = () => {
        props.displaySearchResult(result)
    
    }

    return(
        <>
            <TableRow 
                className = "searchFoodItemResults" 
                hover 
                onClick = {selectFood}
                sx={{ 
                    //I guess it looks better with this, especially because I have the <tr> tage at the end
                    '&:last-child td, &:last-child th': { border: 0 },
                    "&:hover" : {
                        cursor : "pointer"
                    } 
            
                }}
            >
                <TableCell style={{width: '150px'}}>
                    <p style = {{marginTop : "0px", marginBottom : "0px"}}>{result.name}</p>
                    <p style = {{fontSize: "10px", marginTop : "5px", marginBottom : "0px"}}>{result.brand}</p>
                </TableCell>
                {media700W && <TableCell align="right">{parseFloat((result.servingSize).toFixed(2))} {result.servingUnit}</TableCell>}
                <TableCell align="right">{parseFloat((result.calories).toFixed(2))}</TableCell>
                {media500W && <TableCell align="right">{parseFloat((result.fat).toFixed(2))}</TableCell>}
                {media500W && <TableCell align="right">{parseFloat((result.carbs).toFixed(2))}</TableCell>}
                {media500W && <TableCell align="right">{parseFloat((result.protein).toFixed(2))}</TableCell>}
            </TableRow>

        </>
    )
}

export default SearchResult;