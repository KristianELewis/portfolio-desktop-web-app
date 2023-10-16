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

This is literally just pdf viewer except the name is changed, and the file type checked for is image

Its functional, but it auto zooms in.

No point in Iframe here just use an image

========================================================================*/




const ImageViewer = () => {
    //CONTEXT, PROPS, INTIALIZATION
    const processManagmentInfo = useContext(processManagmentContext);
    const {editProgram} = processManagmentInfo;


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

    //FILE MANAGER BACKDROP
    const [fileManagerState, setFileManagerState] = useState({open: false, type : null})

    const handleLoadFile = (type, file) => {
        if(type === "Image Viewer")
        {
            editProgram(id, file);
            setFileManagerState({open : false, type : null})
        }
    }
    const loadFile = () => {
        setFileManagerState({open : true, type : "Load"})
        setFilesAnchor(null)
    }

    const chooseFileManager = () => {
        if(fileManagerState.type === "Load")
        {
            return <FileManager version = "Load" clickFunction = {handleLoadFile}/>
        }
        // if(fileManagerState.type === "Save")
        // {
        //     return <FileManager version = "Save" clickFunction = {handleSaveData}/>
        // }
        else {
            return <></>
        }
    };
    const fileManager = chooseFileManager();

    const handleCancel = () => {
        setFileManagerState({open : false, type : null})
    }
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
            {/* Probably a way to reduce the size of the image but save proportions
                then center in the middle
            */}
            {file && <img src = {file.data} height = {"100%"} width = {"100%"} style = {{boxSizing : "border-box"}}/>}
        </div>

        <Backdrop open = {fileManagerState.open}>
                <div style ={{width : "500px", height : "500px"}}>
                    <AppBar position = "relative" >

                        <ButtonGroup variant="contained">
                            <Button onClick = {handleCancel} size = "small">Cancel</Button>
                            <Button onClick = {handleCancel} size = "small">Load</Button>
                        </ButtonGroup>
                    </AppBar>

                    {fileManager}
                </div>
            </Backdrop> 

        </>
    )
}

export default ImageViewer;

