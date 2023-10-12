/*

TODO


*/

import React, { useContext } from "react";

//Components
import MealItem from "./MealItem";

//material UI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { widthContext } from '../Contexts.js'

import "../stylesheets/meal.css"


const Meal = (props) => {

    const { media700W, media500W } = useContext(widthContext)

    const dispatchBackdrop = props.dispatchBackdrop
    const totals = {
        calories : 0,
        carbs : 0,
        fat : 0,
        protein : 0
    }
    
    //This may be redundant at the moment
    props.meal.mealItems.map((mealItem, i) => {
        totals.calories += mealItem.calories * mealItem.amount
        totals.fat += mealItem.fat * mealItem.amount
        totals.carbs += mealItem.carbs * mealItem.amount
        totals.protein += mealItem.protein * mealItem.amount
    })

    const handleOpenAdd = () => {
        dispatchBackdrop({type: "ADDITEM", dispatch : props.dispatch, meal : props.meal.meal})
    }
    
    const handleOpenMealItemInfo = (loggedID, mealItem) => {
        dispatchBackdrop({type: "MEALITEMINFO", loggedID : loggedID, dispatch : props.dispatch, mealItem: mealItem})

    }

    return (
        <Paper className = "meal">
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{width: '200px'}} >{props.meal.name}</TableCell>
                            {media700W && <TableCell align="right">Serving size</TableCell>}
                            <TableCell align="right">Calories</TableCell>
                            {media500W && <TableCell align="right">Fat&nbsp;(g)</TableCell>}
                            {media500W && <TableCell align="right">Carbs&nbsp;(g)</TableCell>}
                            {media500W && <TableCell align="right">Protein&nbsp;(g)</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.meal.mealItems.map((mealItem, i) => (
                        <MealItem 
                            key = {mealItem.loggedID} 
                            mealItem = {mealItem} 
                            handleOpenMealItemInfo = {handleOpenMealItemInfo}
                        />
                    ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                {/*not sure if typography adds a lot to the file size. I could just use a <p> tag if it does*/}
                                <Typography 
                                    onClick = {handleOpenAdd}
                                    sx = {{
                                        //this is trhe primary color from mui, there might be a more mui way of doing this
                                        //CornflowerBlue = rgb(100,149,237)
                                        color : "rgb(144, 202, 249)",
                                        fontSize : "13px",
                                        display: "inline",
                                        "&:hover" : {
                                            cursor : "pointer",
                                            color: "rgb(50, 150, 255)"
                                        },
                                        "&:active" : {
                                            color: "white"
                                        }
                                    }}
                                >
                                Add Food </Typography>
                                | Totals
                            </TableCell>
                            {media700W && <TableCell align="right"></TableCell>}
                            <TableCell align="right">{parseFloat((totals.calories).toFixed(2))}</TableCell>
                            {media500W && <TableCell align="right">{parseFloat((totals.fat).toFixed(2))}</TableCell>}
                            {media500W && <TableCell align="right">{parseFloat((totals.carbs).toFixed(2))}</TableCell>}
                            {media500W && <TableCell align="right">{parseFloat((totals.protein).toFixed(2))}</TableCell>}
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
    )
}
export default Meal;