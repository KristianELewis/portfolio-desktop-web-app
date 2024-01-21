import React, {useState, useContext} from 'react'
import { windowWidthContext, programContext, processManagmentContext } from '../Context';

import Paper from '@mui/material/Paper'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import TopBarButtons from '../topBarComponents/TopBarButtons';


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
    const { file, id, name, handlePointerDown, doubleClickResize, handleExit, inFocus } = programInfo;

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
            setCurrentFolderId(addProgram("File Manager", {data :{
                version : "Load", 
                requestID : id, 
                requestData : null, 
                acceptableType : "PDF Viewer", 
                programHandler : handleLoadFile,
                requestCanceler : requestCanceler
        }}))

        }
        setFilesAnchor(null)
    }
    const UnLoadFile =() =>{
        editProgram(id, null)
    }

    const handlePointerDownTopBar = (e) => {
        handlePointerDown(e)
        doubleClickResize()
    }
    //============================================================================================
    //The top bar is exactly the same as ImagViewer except for the menu
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
                        {/* <MenuItem onClick={UnLoadFile}>unLoad File</MenuItem> */}
                    </Menu>

                    <Typography noWrap sx = {{width : "100%", textAlign : "center", userSelect : "none", justifySelf: "center"}}>{name}</Typography>
                    <TopBarButtons program = {5} handleExit = {handleExit} preventPositioning = {preventPositioning}/>
            </Paper>
            {/*Whats the point of this div exactly? its in image viewer too */}
            {/*the overflow auto helps with mobile pdfs. For some reason it wont just overflow, it keeps matching the size and stretching. Mobile also doenst work with multiple pages */}
            <div style = {{height: "100%", color : "black", position: "relative", overflow : "auto"}}>
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
                    {/*This is not an iframe but it still behaves like one */}
                    {!inFocus && <div style = {{position: "absolute", backgroundColor: "transparent", height : "100%", width: "100%", boxSizing : "border-box"}}></div>}
                    {file && <object type="application/pdf" data = {file.data} height = {"100%"} width = {"100%"}></object>}
                    {/*file && <iframe src = {file.data} height = {"100%"} width = {"100%"} style = {{boxSizing : "border-box"}}></iframe>*/}
                </Paper>
            </div>
        </div>
    )
}

export default PdfReader;