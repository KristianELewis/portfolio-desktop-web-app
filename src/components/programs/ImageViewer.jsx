import React, {useState, useContext, useRef} from 'react'
import { programContext, processManagmentContext } from '../Context';

import Paper from '@mui/material/Paper'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import TopBarButtons from '../topBarComponents/TopBarButtons';

/*========================================================================

TODO

Doesn't work well on mobile
========================================================================*/
const loadImgDimensions = (file) => {
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
    const {addProgram} = processManagmentInfo;

    const programInfo = useContext(programContext);
    const { file, id, name, handlePointerDown, doubleClickResize, handleExit } = programInfo;

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

    /*=====================================================================
        This is to get scrollwheel and clicking for zoom to work
        probably could do with tweaking.
        This likely nonfunctional on mobile
        event listeners are put in userefs so I can remove them easilyy. Could have maybe done it with usecallback on use effect, I like this way though

        The wheel scrolling needed to be done like this to do prevent default to preevent scrolling up and down the screen

        Not sure how I will manage to do it with touch yet
    =====================================================================*/

    const [ctrlPressed, setCtrlPressed] = useState(false)
    const keyDownFunction = (e) => {
        if(e.key === "Control")
        {
            setCtrlPressed(true)
        }
    }
    const keyUpFunction = (e) => {
        if(e.key === "Control")
        {
            setCtrlPressed(false)
        }
    }

    const wheelOverider = (e) => {
        e.preventDefault()
        if(e.deltaY > 0)
        {
            setMagnificationLevel((oldState) => {
                if( oldState > .1 ){
                    return oldState - .1
                }
                else{
                    return oldState
                }
            })
        }
        else if (e.deltaY < 0)
        {
            setMagnificationLevel((oldState) => {
                if( oldState < 4 ){
                    return oldState + .1
                }
                else{
                    return oldState
                }
            })
        }
    }

    const keyDownRef = useRef(keyDownFunction)
    const keyUpRef = useRef(keyUpFunction)

    const wheelOveriderRef = useRef(wheelOverider)
    const handleMouseEnter = () => {
        window.addEventListener("keydown", keyDownRef.current);
        window.addEventListener("keyup", keyUpRef.current);
        window.addEventListener("wheel", wheelOveriderRef.current, { passive: false })
    }
    const handleMouseLeave = () => {
        window.removeEventListener("keydown", keyDownRef.current);
        window.removeEventListener("keyup", keyUpRef.current);
        window.removeEventListener("wheel", wheelOveriderRef.current);

        setCtrlPressed(false) //makes sure ctrl is set back to false if they leave the image without letting go of ctrl
    }
    const handleImageClick = (e) => {
        if(ctrlPressed)
        {
            setMagnificationLevel((oldState) => {
                if( oldState > .2 ){
                    return oldState - .2
                }
                else{
                    return oldState
                }
            })
        }
        else{
            setMagnificationLevel((oldState) => {
                if( oldState < 4 ){
                    return oldState + .2
                }
                else{
                    return oldState
                }
            })
        }
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
            setCurrentFolderId(addProgram("File Manager", {data :{
                version : "Load", 
                requestID : id, 
                requestData : null, 
                acceptableType : "Image Viewer", 
                programHandler : handleLoadFile,
                requestCanceler : requestCanceler
            }}))
        }
        setFilesAnchor(null)
    }
    //================================================
    const handlePointerDownTopBar = (e) => {
        handlePointerDown(e)
        doubleClickResize()
    }
    return(
        <div className = "windowMidContainer" style = {{width : "100%"}}>
            <Paper position = "relative" sx = {{height : "40px", padding: "0 5px 0 5px", boxSizing : "border-box", borderRadius : "10px 10px 0 0" , display : "grid", gridTemplateColumns : "1fr 1fr 1fr", alignItems : "center"}} onPointerDown = {handlePointerDownTopBar}>
                <Button size = "small" color = 'inherit' onClick = {handleFilesClick} onPointerDown = {preventPositioning} sx = {{justifySelf : "flex-start", textTransform : "none", fontSize : "16px", padding : "0"}}>Files</Button>
                <Menu
                    anchorEl={filesAnchor}
                    open = {fileOpen}
                    onClose ={handleCloseFiles}
                    onPointerDown = {preventPositioning}
                >
                    <MenuItem onClick={loadFile}>Load File</MenuItem>
                    <MenuItem onClick={() => {setMagnificationLevel(.5)}}>.5x magnification</MenuItem>
                    <MenuItem onClick={() => {setMagnificationLevel(1)}}>1x magnification</MenuItem>
                    <MenuItem onClick={() => {setMagnificationLevel(2)}}>2x magnification</MenuItem>
                    <MenuItem onClick={() => {setMagnificationLevel(4)}}>4x magnification</MenuItem>


                </Menu>
                <Typography noWrap sx = {{width : "100%", textAlign : "center", userSelect : "none", justifySelf: "center"}}>{name}</Typography>
                <TopBarButtons program = {4} handleExit = {handleExit} preventPositioning = {preventPositioning}/>
            </Paper>
            {/*This is the inner window */}
            <Paper 
                onClick = {handleImageClick}
                onMouseEnter = {handleMouseEnter}
                onMouseLeave = {handleMouseLeave}
                
                elevation = {0} 
                sx = {{
                    width : "100%", 
                    height : "100%", 
                    boxSizing : "border-box", 
                    borderRadius : "0 0 10px 10px", 
                    overflow : "auto",
                    display : "flex",
                    justifyContent : "center",
                    alignItems : "center",
                    cursor : (ctrlPressed) ? "zoom-out" : "zoom-in"
                    }}>
                    {/*more flex box that could probably be changed to something else */}
                    {file && <img 
                            src = {file.data.src} 
                            height = {imgDimensions.height * magnificationLevel} 
                            width = {imgDimensions.width * magnificationLevel} 
                            />}
            </Paper> 
        </div>
    )
}

export default ImageViewer;