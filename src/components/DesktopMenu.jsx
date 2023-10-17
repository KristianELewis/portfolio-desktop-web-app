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

import FileManager from "./programs/FileManager/FileManager"



//need to make the app bar smaller, very annoying right now though
const DesktopMenu = (props) => {

    /*
        This doesnt seem to effect preformance much. Can change the interval if it starts to, but 1 second keeps it pretty accurate and really shouldnt be a big deal
        Still not sure if I'm using useEffect correctly. Not sure if useEffect is the right choice here, I guess this is getting info from an outside source.
    */
    const currentTimeAndDate = () => {
        let currentDate = new Date()
        //console.log(dayjs(currentDate).format('dddd, MMMM D, YYYY h:mm A'))
        return (dayjs(currentDate).format('dddd, MMMM D, YYYY h:mm A'));
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

//===================================================



/*===========================================================================

    FILE MANAGEMENT

    -any meaningfull notes are in text editor, this is just a simplier implementation

===========================================================================*/

const [currentFolderId, setCurrentFolderId] = useState(null)
const {setBackgroundImageUrl, removeProgram, addProgram} = props

    const requestCanceler = () => {
        setCurrentFolderId(null)
    }
    const handleSetBackgroundImage = (type, file) => {
        if(type === "Image Viewer")
        {
            setBackgroundImageUrl(file.data);
        }
        //removeProgram(currentFolderId)
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
            //setCurrentFolderId(props.addProgram("File Manager", {version : "Load", clickFunction : handleSetBackgroundImage}))
        }
        setFilesAnchor(null)
    }


//=============================================================================







    const handleCloseFiles = () => {
        setFilesAnchor(null)
    }

    return (
        <AppBar position = "relative" sx ={{display : "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
            <Toolbar sx ={{boxSizing: "border-box"}}>
                <Button color = 'inherit' onClick = {handleFilesClick}>Programs</Button>
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
                </Menu>
            </Toolbar>
            <Typography variant = "body1"sx = {{margin: "auto", textAlign: "center"}}>{dateTime}</Typography>
            <Button onClick = {props.displayPrograms}>Display Info</Button>
            {/* <div>{/*maybe this will be a settings/ logout section }</div> */}
        </AppBar>
    )
}


export default DesktopMenu;



/* ()=>{
                        fileInput.current.click()
                        /*setting files anchor to null here wont let the background picture get chosen.
                        right now it choses from the users computer. When I implement file system it will change to using that. There will need to be an upload files
                        button to move files from the users computer into the website
                        
                        }}>Change Desktop Background
                        <input
                            ref ={fileInput}
                            type="file"
                            onChange = {handleChangeDesktopBackground}
                            hidden
                        /> */

                            /*
    const [file, setFile] = useState(null);
    const fileInput = useRef();
    
    async function verifyImage() {
        return new Promise((resolve) => 
        {
            let image = new Image();
            image.onload = function() {
                resolve( {valid : true, url : image.src})
            }
            image.onerror = function() {
                resolve({valid : false, url : null})
            }
            image.src = URL.createObjectURL(file)
        })
    }
    */

                //console.log("Changeing background picture")
            //setBackgroundImageUrl(URL.createObjectURL(e.target.files[0]))
            //props.addProgram("Calorie Counter")