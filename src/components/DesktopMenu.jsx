import React, {useState} from 'react';

//materialUI stuff
//need to switch to import paths
import { AppBar, Button, Toolbar, Typography, IconButton} from '@mui/material'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MenuIcon from '@mui/icons-material/Menu';



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