import React, {useState} from 'react';

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

    const [filesAnchor, setFilesAnchor] = useState(null);
    const fileOpen = Boolean(filesAnchor);
    const handleFilesClick = (e) => {
        setFilesAnchor(e.currentTarget)
    }

    const handleAddTextEditor = () => {
        props.addProgram("Text Editor")
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
                </Menu>
            </Toolbar>
        </AppBar>
    )
}


export default DesktopMenu;