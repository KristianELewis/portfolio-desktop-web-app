import React from "react"

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const NewComplexFile = (props) => {

    const {handlePointerDown, name, folderNameInput, handleFolderNameInputChange, handleClose, preventPositioning, cancelBackdrop, fileSet, uploadFile, setFileSet, setUploadFile} = props;

    
    return( 
        <>
        <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}} onPointerDown = {handlePointerDown}>
            <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
            <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}> New {name}</p>
            <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {handleClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
        </Paper>
        <div style = {{textAlign : "left", padding : "16px", width : "100%"}}>
            <p style = {{marginTop : "0px", marginBottom : "2px", fontSize : "14px"}}>{name} Name</p>
            <TextField size = "small" fullWidth value = {folderNameInput} onChange = {handleFolderNameInputChange} inputProps = {{style : {height : "16px"}}}></TextField>
            <div style = {{display: "flex", justifyContent: "space-between", alignItems : "center", marginTop : "10px"}}>
                <p style = {{marginTop : "0px", marginBottom : "2px", fontSize : "14px"}}>File Downloader</p>
                <Button
                    variant="contained"
                    component="label"
                    size = "small"
                    sx = {{textTransform : "none", maxWidth : "150px"}}
                    >
                    <Typography sx = {{ fontSize : "14px"}} noWrap>{fileSet ? uploadFile.name : "Download File" /*disabled = {deleteChecked}*/}</Typography>
                    <input
                        type="file"
                        accept = "application/pdf"
                        onChange = {(e) => {
                            if(e.target.files.length < 1){
                                setFileSet(false);
                                setUploadFile(null);
                            }
                            else{
                                setFileSet(true);
                                setUploadFile(e.target.files[0]);
                            }
                        }}
                        hidden
                    />
                </Button>
            </div>
        </div>
        </>
    )
}

export default NewComplexFile;