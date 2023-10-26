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

Need to add magnify glass and clicking for zooming in an out.
Using zoom in files for now
========================================================================*/
const loadImgDimensions = (file) => {
    console.log(file)
    if(file !== null){
        return file.data.dimensions
    }
    else{
        return {height : null, width : null}
    }
}
const ImageViewer = () => {
    //CONTEXT, PROPS, INTIALIZATION
    const processManagmentInfo = useContext(processManagmentContext);
    const {editProgram, addProgram} = processManagmentInfo;

    const { windowPositioningInUse, }= useContext(windowWidthContext)
    const programInfo = useContext(programContext);
    const { file, id, name, handleMouseDown, handleExit } = programInfo;

    const [imgDimensions, setImgDimensions] = useState(() => loadImgDimensions(file))
    const [magnificationLevel, setMagnificationLevel] = useState(1);
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
        setImgDimensions(loadImgDimensions(file))
        setCurrentFolderId(null)
    }
    const loadFile = () => {
        if(currentFolderId === null){
            setCurrentFolderId(addProgram("File Manager", {
                version : "Load", 
                requestID : id, 
                requestData : null, 
                acceptableType : "Image Viewer", 
                programHandler : handleLoadFile,
                requestCanceler : requestCanceler
            }))
        }
        setFilesAnchor(null)
    }
    //================================================
    
    
    return(
        <div className = "windowMidContainer" style = {{width : "100%"}}>
            <Paper position = "relative" sx = {{height : "40px", padding: "0 5px 0 5px", boxSizing : "border-box", borderRadius : "10px 10px 0 0" , display : "grid", gridTemplateColumns : "1fr 1fr 1fr", alignItems : "center"}} onMouseDown = {handleMouseDown}>
                <Button size = "small" color = 'inherit' onClick = {handleFilesClick} onMouseDown = {preventPositioning} sx = {{justifySelf : "flex-start", textTransform : "none", fontSize : "16px", padding : "0"}}>Files</Button>
                <Menu
                    anchorEl={filesAnchor}
                    open = {fileOpen}
                    onClose ={handleCloseFiles}
                    onMouseDown = {preventPositioning}
                >
                    <MenuItem onClick={loadFile}>Load File</MenuItem>
                    <MenuItem onClick={() => {setMagnificationLevel(.5)}}>.5x magnification</MenuItem>
                    <MenuItem onClick={() => {setMagnificationLevel(1)}}>1x magnification</MenuItem>
                    <MenuItem onClick={() => {setMagnificationLevel(2)}}>2x magnification</MenuItem>
                    <MenuItem onClick={() => {setMagnificationLevel(4)}}>4x magnification</MenuItem>


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
                {/*is this really necessary here? */}
                {windowPositioningInUse && <div style = {{position: "absolute", backgroundColor: "transparent", height : "100%", width: "100%", boxSizing : "border-box"}}></div>}
                <Paper 
                    elevation = {0} 
                    sx = {{
                        width : "100%", 
                        height : "100%", 
                        boxSizing : "border-box", 
                        borderRadius : "0 0 10px 10px", 
                        overflow : "auto",
                        display : "flex",
                        justifyContent : "center",
                        alignItems : "center"
                        }}>
                        {/*more flex box that could probably be changed to something else */}
                        {file && <img 
                                src = {file.data.src} 
                                height = {imgDimensions.height * magnificationLevel} 
                                width = {imgDimensions.width * magnificationLevel} 
                                />}
                </Paper> 
                {/* Probably a way to reduce the size of the image but save proportions
                    then center in the middle
                */}
        </div>
    )
}

export default ImageViewer;