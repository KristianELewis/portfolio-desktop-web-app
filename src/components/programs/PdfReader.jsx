import React, {useState, useContext} from 'react'
import { windowWidthContext, programContext, processManagmentContext } from '../Context';

import FileManager from './FileManager/FileManager';

import Paper from '@mui/material/Paper'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography'
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
    const UnLoadFile =() =>{
        editProgram(id, null)
    }
    //============================================================================================
    //The top bar is exactly the same as ImagViewer except for the menu
    return(
        <>
        <Paper position = "relative" sx = {{height : "40px", padding: "0 5px 0 5px", boxSizing : "border-box", borderRadius : "5px 5px 0 0" , display : "grid", gridTemplateColumns : "1fr 1fr 1fr", alignItems : "center"}} onMouseDown = {handleMouseDown}>
        <Button size = "small" color = 'inherit' onClick = {handleFilesClick} onMouseDown = {preventPositioning} sx = {{justifySelf : "flex-start", textTransform : "none", fontSize : "16px", padding : "0"}}>Files</Button>
            <Menu
                anchorEl={filesAnchor}
                open = {fileOpen}
                onClose ={handleCloseFiles}
                onMouseDown = {preventPositioning}
            >
                <MenuItem onClick={loadFile}>Load File</MenuItem>
                <MenuItem onClick={UnLoadFile}>unLoad File</MenuItem>
            </Menu>

            <Typography sx = {{userSelect : "none", justifySelf: "center"}}>{name}</Typography>
            <CloseIcon 
                sx = {{
                    justifySelf: "flex-end",
                    color : "white",
                    "&:hover": { backgroundColor: "black" }
                }}
                onClick = {handleExit}
                onMouseDown = {preventPositioning}
            />
        </Paper>
        {/*Whats the point of this div exactly? its in image viewer too */}
        <div style = {{height: "100%", color : "black", position: "relative"}}>
            {windowPositioningInUse && <div style = {{position: "absolute", backgroundColor: "transparent", height : "100%", width: "100%", boxSizing : "border-box"}}></div>}
            <Paper 
                elevation = {0}
                sx = {{
                    width : "100%", 
                    height : "100%", 
                    boxSizing : "border-box", 
                    borderRadius : "0 0 5px 5px", 
                    overflow : "auto",
                    display : "flex",
                    justifyContent : "center",
                    alignItems : "center"
                    }}>
                {file && <iframe src = {file.data} height = {"100%"} width = {"100%"} style = {{boxSizing : "border-box"}}></iframe>}
            </Paper>
        </div>
        </>
    )
}

export default PdfReader;