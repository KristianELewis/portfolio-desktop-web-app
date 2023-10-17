import React, {useState, useContext} from 'react'
import { windowWidthContext, programContext, processManagmentContext } from '../Context';

import FileManager from './FileManager/FileManager';

import Paper from '@mui/material/Paper'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Paper'
import CloseIcon from '@mui/icons-material/Close';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import AppBar from '@mui/material/AppBar';
import Backdrop from '@mui/material/Backdrop'

/*========================================================================

TODO

for now I will just use an iframe, It seems to work well. Just need to put a transparent div in front of the iframe when moving or resizing 

========================================================================*/

const PdfReader = () => {
    //CONTEXT, PROPS, INTIALIZATION
    const processManagmentInfo = useContext(processManagmentContext);
    const {editProgram, addProgram, removeProgram, programs} = processManagmentInfo;


    const { windowPositioningInUse, }= useContext(windowWidthContext)
    const programInfo = useContext(programContext);
    const { file, id, name, handleMouseDown, handleExit } = programInfo;

    //MENU ITEMS
    const [filesAnchor, setFilesAnchor] = useState(null);
    const fileOpen = Boolean(filesAnchor);
    const handleFilesClick = (e) => {
        setFilesAnchor(e.currentTarget)
    }
    const handleCloseFiles = () => {
        setFilesAnchor(null)
    }
    const preventPositioning = (e) =>{
        e.stopPropagation()
    }

    /*===========================================================================

        FILE MANAGEMENT

        -Explanation in text editor

    ===========================================================================*/

    const [currentFolderId, setCurrentFolderId] = useState(null)

    const requestCanceler = () => {
        setCurrentFolderId(null)
    }
    const handleLoadFile = (type, file) => {
        setCurrentFolderId(null)
    }
    const loadFile = () => {
        if(currentFolderId === null){
            setCurrentFolderId(addProgram("File Manager", {
                version : "Load", 
                requestID : id, 
                requestData : null, 
                acceptableType : "PDF Viewer", 
                programHandler : handleLoadFile,
                requestCanceler : requestCanceler
            }))

        }
        setFilesAnchor(null)
    }

    //============================================================================================
    return(
        <>
        <Paper position = "relative" sx = {{height : "40px", display : "flex", justifyContent : "space-between", alignItems : "center"}} onMouseDown = {handleMouseDown}>
            <Button color = 'inherit' onClick = {handleFilesClick} onMouseDown = {preventPositioning}>Files</Button>
            <Menu
                anchorEl={filesAnchor}
                open = {fileOpen}
                onClose ={handleCloseFiles}
                onMouseDown = {preventPositioning}
            >
                <MenuItem onClick={loadFile}>Load File</MenuItem>
            </Menu>

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
            {!file && <Paper sx = {{width : "100%", height : "100%", boxSizing : "border-box"}}></Paper>}
            {file && <iframe src = {file.data} height = {"100%"} width = {"100%"} style = {{boxSizing : "border-box"}}></iframe>}
        </div>
        </>
    )
}

export default PdfReader;