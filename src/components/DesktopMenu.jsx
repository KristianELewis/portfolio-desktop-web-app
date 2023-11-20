import React, {useState, useRef, useEffect} from 'react';

//materialUI stuff
//need to switch to import paths
import  AppBar from '@mui/material/AppBar'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
//import MenuIcon from '@mui/icons-material/Menu';

import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'

import Typography from '@mui/material/Typography'
//import IconButton from '@mui/material/IconButton'

import dayjs from 'dayjs'

//import FileManager from "./programs/FileManager/FileManager"


//need to make the app bar smaller, very annoying right now though
const DesktopMenu = (props) => {
    /*
        This doesnt seem to effect preformance much. Can change the interval if it starts to, but 1 second keeps it pretty accurate and really shouldnt be a big deal
        Still not sure if I'm using useEffect correctly. Not sure if useEffect is the right choice here, I guess this is getting info from an outside source.
        can have different versions of this maybe

        Or perhaps just the time, but date is something you can click on and it brings up a calendar like in windows
    */
    const currentTimeAndDate = () => {
        let currentDate = new Date()
        //console.log(dayjs(currentDate).format('dddd, MMMM D, YYYY h:mm A'))
        return (dayjs(currentDate).format('dddd, MM/D/YYYY h:mm A'));
    }

    const [dateTime, setDateTime] = useState(currentTimeAndDate);

    useEffect(() => {
        const interval = setInterval(() => setDateTime(currentTimeAndDate), 1000);
        return () => clearInterval(interval);
    }, [dateTime])

    const [filesAnchor, setFilesAnchor] = useState(null);
    const fileOpen = Boolean(filesAnchor);
    const handleFilesClick = (e) => {
        setFilesAnchor(e.currentTarget)
    }

    //These can be made more generic for sure
    
    const handleAddTextEditor = () => {
        props.addProgram("Text Editor", null)
        setFilesAnchor(null)
    }
    const handleAddCalculator = () => {
        props.addProgram("Calculator", null)
        setFilesAnchor(null)
    }
    const handleAddCalorieCounter = () => {
        props.addProgram("Calorie Counter", null)
        setFilesAnchor(null)
    }
    const handleAddPdfReader = () => {
        props.addProgram("PDF Viewer", null)
        setFilesAnchor(null)
    }
    const handleAddImageViewer = () => {
        props.addProgram("Image Viewer", null)
        setFilesAnchor(null)
    }
    const handlePianoSynthJS = () => {
        props.addProgram("PianoSynthJS", null)
        setFilesAnchor(null)
    }

    /*
        for file managers, the file parameter will be just an object. It will hold the file manager version and clickehandler 
    */
    const handleAddFileManager = () => {
        props.addProgram("File Manager", {
            version : "Standalone", 
            clickFunction : null, 
            requestID : null, 
            requestData : null, 
            acceptableType : null, 
            programHandler : null, 
            requestCanceler : null
        })
        setFilesAnchor(null)
    }

    /*===========================================================================

        FILE MANAGEMENT

        -Explanation in text editor

    ===========================================================================*/

    const [currentFolderId, setCurrentFolderId] = useState(null)
    const {setBackgroundImageUrl, removeProgram, addProgram, screenWidth} = props

    const requestCanceler = () => {
        setCurrentFolderId(null)
    }
    const handleSetBackgroundImage = (type, file) => {
        if(type === "Image Viewer")
        {
            setBackgroundImageUrl(file.data.src);
        }
        setCurrentFolderId(null)
    }
    const handleChangeDesktopBackground = (e) => {
        if (currentFolderId === null){
            setCurrentFolderId(addProgram("File Manager", {
                version : "SetBackground", 
                requestID : null, 
                requestData : null, 
                acceptableType : "Image Viewer", 
                programHandler : handleSetBackgroundImage,
                requestCanceler : requestCanceler
            }))
        }
        setFilesAnchor(null)
    }
    //=============================================================================
    const handleCloseFiles = () => {
        setFilesAnchor(null)
    }

    return (
        <AppBar position = "relative" sx ={{display : "grid", gridTemplateColumns: "100px auto", height : "40px"}}>
            <Button size = "small" color = 'inherit' onClick = {handleFilesClick} sx = {{justifySelf : "start", textTransform : "none", fontSize : "18px", width : "100px"}}>Start</Button>
                <Menu
                    anchorEl={filesAnchor}
                    open = {fileOpen}
                    onClose ={handleCloseFiles}
                >
                    <MenuItem onClick={handleAddTextEditor}>Text Editor</MenuItem>
                    <MenuItem onClick={handleAddCalculator}>Calculator</MenuItem>
                    <MenuItem onClick={handleAddCalorieCounter}>Calorie Counter</MenuItem>
                    <MenuItem onClick={handleAddPdfReader}>PDF Reader</MenuItem>
                    <MenuItem onClick={handleAddImageViewer}>Image Viewer</MenuItem>
                    <MenuItem onClick={handleAddFileManager}>File Manager</MenuItem>
                    <MenuItem onClick={handleChangeDesktopBackground} >Change Desktop Background </MenuItem>
                    <MenuItem onClick={handlePianoSynthJS}>PianoSynthJS</MenuItem>

                </Menu>
            <Typography noWrap align = 'center' sx = {{ width : "100%", verticalAlign: "baseline", marginTop: "auto", marginBottom: "auto", paddingRight: "10px", textAlign : "right", userSelect : "none"}}>{dateTime}</Typography>
            {/*<Button onClick = {props.displayPrograms}>Display Info</Button>*/}
            {/*maybe this will be a settings/ logout section */}
        </AppBar>
    )
}

export default DesktopMenu;