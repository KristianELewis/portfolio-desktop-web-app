import React, {useState, useContext} from 'react'
import { windowWidthContext, programContext } from '../Context';


import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Paper'
import CloseIcon from '@mui/icons-material/Close';

const Calculator = () => {
    const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3]

    const programInfo = useContext(programContext);

    const { file, id, name, handleMouseDown, handleExit } = programInfo;

    const preventPositioning = (e) =>{
        e.stopPropagation()
    }
    return (

        <>
        <Paper position = "relative" sx = {{height : "40px", display : "flex", justifyContent : "space-between", alignItems : "center"}} onMouseDown = {handleMouseDown}>
            {/* <Button color = 'inherit' onClick = {handleFilesClick} onMouseDown = {preventPositioning}>Files</Button>
            <Menu
                anchorEl={filesAnchor}
                open = {fileOpen}
                onClose ={handleCloseFiles}
                onMouseDown = {preventPositioning}
            >
                <MenuItem onClick={newFile}>New File</MenuItem>
                <MenuItem onClick={saveData}>Save File</MenuItem>
                <MenuItem onClick={loadFile}>Load File</MenuItem>
            </Menu> */}

            <Typography sx = {{userSelect : "none", paddingLeft : "10px"}}>{ name }</Typography>
            <CloseIcon 
                sx = {{
                    color : "white",
                    "&:hover": { backgroundColor: "black" }
                }}
                onClick = {handleExit}
                onMouseDown = {preventPositioning}
            />
        </Paper>
        
        <div style = {{height: "100%", overflow: 'auto', backgroundColor: 'orange'}}>

            <div 
                className = "calculatorDisplay"
                style={{display: "flex", flexDirection: "column", alignItems: "flex-end", boxSizing: "border-box", padding : "10px"}}    
            >
                <p>Output</p>
                <p>input</p>
            </div>
            <h1>test</h1>
    
        </div>
        </>
    )
}


export default Calculator;