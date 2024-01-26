import React from "react"

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const NewSimpleMenu = (props) => {

    const {handlePointerDown, name, folderNameInput, handleFolderNameInputChange, handleNewFolderClose, preventPositioning, cancelBackdrop} = props;


    return (
        <>
        <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}} onPointerDown = {handlePointerDown}>
            <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
            <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}> New {name}</p>
            <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {handleNewFolderClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
        </Paper>
        <div style = {{textAlign : "left", padding : "16px", width : "100%"}}>
            <p style = {{marginTop : "0px", marginBottom : "2px", fontSize : "14px"}}>{name} Name</p>
            <TextField size = "small" fullWidth value = {folderNameInput} onChange = {handleFolderNameInputChange} inputProps = {{style : {height : "16px"}}}></TextField>
        </div>
        </>
    )
}

export default NewSimpleMenu;