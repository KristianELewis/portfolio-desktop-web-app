import React, {useState, useContext} from 'react'
import { windowWidthContext, programContext } from '../Context';

import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Paper'
import CloseIcon from '@mui/icons-material/Close';

/*========================================================================

TODO

for now I will just use an iframe, It seems to work well. Just need to put a transparent div in front of the iframe when moving or resizing 

This file should be improved whem a file/folder system is implemented

Whenm no pdf is loaded, I need to have some sort of menu system to load a pdf from the programs local files

========================================================================*/


import pdfFile from './Resume.pdf'
//This shouldnt load files like this in the future. need to get the files from public or local storage when I figure out how that works



// see if you can do an onlick for the iframe, if yes then make that focus it

const PdfReader = () => {
    const { windowPositioningInUse, }= useContext(windowWidthContext)

    const programInfo = useContext(programContext);

    const { file, id, name, handleMouseDown, handleExit } = programInfo;

    const preventPositioning = (e) =>{
        e.stopPropagation()
    }
    return(
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
        <div style = {{height: "100%", color : "black", position: "relative"}}>
            {windowPositioningInUse && <div style = {{position: "absolute", backgroundColor: "transparent", height : "100%", width: "100%", boxSizing : "border-box"}}></div>}
            <iframe src = {pdfFile} height = {"100%"} width = {"100%"} style = {{boxSizing : "border-box"}}></iframe>
        </div>
        </>
    )
}

export default PdfReader;

