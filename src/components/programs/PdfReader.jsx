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

This file should be improved whem a file/folder system is implemented

Whenm no pdf is loaded, I need to have some sort of menu system to load a pdf from the programs local files

========================================================================*/


import pdfFile from './Resume.pdf'
//This shouldnt load files like this in the future. need to get the files from public or local storage when I figure out how that works



// see if you can do an onlick for the iframe, if yes then make that focus it

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

    -any meaningfull notes are in text editor, this is just a simplier implementation

===========================================================================*/

    const [currentFolderId, setCurrentFolderId] = useState(null)

    const requestCanceler = () => {
        setCurrentFolderId(null)
    }
    const handleLoadFile = (type, file) => {
        // if(type === "PDF Viewer")
        // {
        //     editProgram(id, file);
        // }
        //removeProgram(currentFolderId)
        setCurrentFolderId(null)
    }
    const loadFile = () => {
        if(currentFolderId === null){
            //setCurrentFolderId(addProgram("File Manager", {version : "Load", clickFunction : handleLoadFile}))
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

/*

    OLD FILE MANAGER STUFF, WILL PROBABLY BE DELETED VERY SOON

    const [fileManagerState, setFileManagerState] = useState({open: false, type : null})

    const handleLoadFile = (type, file) => {
        if(type === "PDF Viewer")
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

*/