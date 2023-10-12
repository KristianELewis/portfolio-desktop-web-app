import React, {useState, useRef} from 'react';

//materialUI stuff
//need to switch to import paths
import  AppBar from '@mui/material/AppBar'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'

import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

//need to make the app bar smaller, very annoying right now though
const DesktopMenu = (props) => {
    const {setBackgroundImageUrl} = props
    
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

    const [filesAnchor, setFilesAnchor] = useState(null);
    const fileOpen = Boolean(filesAnchor);
    const handleFilesClick = (e) => {
        setFilesAnchor(e.currentTarget)
    }

    //Probably would be better to not have a separate function for each program choice
    
    const handleAddTextEditor = () => {
        props.addProgram("Text Editor")
        setFilesAnchor(null)
    }
    const handleAddCalculator = () => {
        props.addProgram("Calculator")
        setFilesAnchor(null)
    }
    const handleAddCalorieCounter = () => {
        props.addProgram("Calorie Counter")
        setFilesAnchor(null)
    }
    const handleChangeDesktopBackground = (e) => {
        console.log("Changeing background picture")
        setBackgroundImageUrl(URL.createObjectURL(e.target.files[0]))
        //props.addProgram("Calorie Counter")
        setFilesAnchor(null)
    }
    const handleCloseFiles = () => {
        setFilesAnchor(null)
    }

    return (
        <AppBar position = "relative">
            <Toolbar sx ={{flexGrow : 1}}>
                <Button color = 'inherit' onClick = {handleFilesClick}>Programs</Button>
                <Menu
                    anchorEl={filesAnchor}
                    open = {fileOpen}
                    onClose ={handleCloseFiles}
                >
                    <MenuItem onClick={handleAddTextEditor}>Text Editor</MenuItem>
                    <MenuItem onClick={handleAddCalculator}>Calculator</MenuItem>
                    <MenuItem onClick={handleAddCalorieCounter}>Calorie Counter</MenuItem>
                    <MenuItem onClick={()=>{
                        fileInput.current.click()
                        /*setting files anchor to null here wont let the background picture get chosen.
                        right now it choses from the users computer. When I implement file system it will change to using that. There will need to be an upload files
                        button to move files from the users computer into the website
                        */
                        }}>Change Desktop Background
                        <input
                            ref ={fileInput}
                            type="file"
                            onChange = {handleChangeDesktopBackground}
                            hidden
                        />
                    </MenuItem>

                </Menu>
            </Toolbar>
        </AppBar>
    )
}


export default DesktopMenu;