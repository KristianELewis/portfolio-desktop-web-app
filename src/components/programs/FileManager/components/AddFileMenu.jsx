import React, {useState} from "react";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

/*===========================================================

The contents don't need their own file right now. When I make a "file transfer" program I will remove the pdf/image version and will just have the basic one

Which means Ill end up removing this component anyway

===========================================================*/
const FileMenuContents = (props) => {

    const {
        handlePointerDown,
        promptState,
        folderNameInput,
        handleFolderNameInputChange,
        preventPositioning,
        cancelBackdrop,
        fileSet,
        uploadFile,
        setFileSet,
        setUploadFile,
        handleNewFolderClose,
        handleNewTXTClose,
        handleNewPDFClose,
        handleNewImageClose
    } = props;
    const {type, name} = promptState;

    if(type === "Folder" || type === "TXT"){
        return (
            <>
            <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}} onPointerDown = {handlePointerDown}>
                <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
                <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}> New {name}</p>
                <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {type === "Folder" ? handleNewFolderClose : handleNewTXTClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
            </Paper>
            <div style = {{textAlign : "left", padding : "16px", width : "100%"}}>
                <p style = {{marginTop : "0px", marginBottom : "2px", fontSize : "14px"}}>{name} Name</p>
                <TextField size = "small" fullWidth value = {folderNameInput} onChange = {handleFolderNameInputChange} inputProps = {{style : {height : "16px"}}}></TextField>
            </div>
            </>
        )
    }
    else if(type === "PDF" || type === "IMAGE"){
        return (
            <>
            <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}} onPointerDown = {handlePointerDown}>
                <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
                <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}> New {name}</p>
                <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {type === "PDF" ? handleNewPDFClose : handleNewImageClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
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
                        {/*I use fileSet because I can't set the file to null until after the file has been created. Which can cause issues */}
                        <Typography sx = {{ fontSize : "14px"}} noWrap>{fileSet ? uploadFile.name : "Download File" /*disabled = {deleteChecked}*/}</Typography>
                        <input
                            type="file"
                            accept = {name === "PDF File" ? "application/pdf" : "image/*"}
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
    else{
        return(  //Idk if there is a point in having this here
            <div width = {"100px"}>
            </div>
        )
    }
}


const AddFileMenu = (props) => {

    const {currentFolder, setCurrentFolderView, setFileSystemState, contextMenu, handleCloseContextMenu, handlePointerDown, preventPositioning} = props;
    //these can be condensed
    const [uploadFile, setUploadFile] = useState(null);
    const [fileSet, setFileSet] = useState(false);

    const [folderNameInput, setFolderNameInput] = useState("");
    const handleFolderNameInputChange = (e) => {
        setFolderNameInput(e.target.value)
    }

    /*===============================================================================

        ADDING NEW FILES AND FOLDERS

        -So much of this is generic and the same, This can be cutdown for sure
            -This is low priority at the moment but it should be done before any more file types are added

        TODO

        Eventually I think I want a "File Transfer" program to "Upload" your own files to the website. Then get rid of add new pdf and image functionality from here, Which should help clean up a lot
    
    ===============================================================================*/
    const addNewFolder = () => {
        if (folderNameInput !== ""){
            currentFolder.current.addNewFolder(folderNameInput);
            //is this part right here really necessary? is Setting the fileSystemState enough?
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            setFileSystemState((prevState) => {return prevState * -1})
        }
        setFolderNameInput("");
    }
    const addNewTxtFile = () => {
        if (folderNameInput !== ""){
            //I have to figure something else out about this. File types and process types should be separated
            const data = [
                {
                    type: 'paragraph',
                    children: [{ text: '' }],
                },
            ]
            currentFolder.current.addNewFile(folderNameInput, "Text Editor", data);
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            setFileSystemState((prevState) => {return prevState * -1})
        }
        setFolderNameInput("");
    }
    const addNewPDFFile = () => {
        if (folderNameInput !== "" && uploadFile){
            const data = URL.createObjectURL(uploadFile)
            //I have to figure something else out about this. File types and process types should be separated
            currentFolder.current.addNewFile(folderNameInput, "PDF Viewer", data);
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            setFileSystemState((prevState) => {return prevState * -1})
        }
        setFolderNameInput("");
    }

    async function getDimensions (dataURL) {
        return new Promise(resolve => {
            let img = new Image;
            img.onload = () => {
                resolve({height : img.height, width : img.width})
            }
            img.src = dataURL;
        })
    }
    const addNewImageFile = () => {
        if (folderNameInput !== "" && uploadFile){
            const url = URL.createObjectURL(uploadFile)
            getDimensions(url).then( results => {
                const data = {src : url, dimensions : results}
                currentFolder.current.addNewFile(folderNameInput, "Image Viewer", data);
                setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
                setFileSystemState((prevState) => {return prevState * -1})
            })
        }
        setFolderNameInput("");
    }
    
    /*===============================================================================
    ---------------------------------------------------------------------------------
    ===============================================================================*/

    const [promptState, setPromptState] = useState({open : false, type : null, name : null})
    //If handleNewClick is given an invalid type it breaks. Should never happen, but something to remember for potential changes/refactors
    const handleNewClick = (type, name) => {
        handleCloseContextMenu(); //Closes the context menu
        setPromptState({open : true, type : type, name : name})
    }
    const handleNewFolderClose = () => {
        setPromptState({open : false, type : null, name : null})
        addNewFolder()
    }
    const handleNewTXTClose = () => {
        setPromptState({open : false, type : null, name : null})
        addNewTxtFile()
    }
    const handleNewPDFClose =() => {
        setPromptState({open : false, type : null, name : null})
        addNewPDFFile();
        setFileSet(false);
    }
    const handleNewImageClose = () => {
        setPromptState({open : false, type : null, name : null})
        addNewImageFile();
        setFileSet(false);
    }
    const cancelBackdrop = () => {
        setUploadFile(null);
        setFileSet(false);
        setFolderNameInput("");
        setPromptState({open : false, type : null, name : null})
    }

    return (
        <>
            {/*From the material ui demo */}
            <Menu
            open={contextMenu !== null}
            onClose={handleCloseContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
            contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
        >
            <MenuItem onClick={() => {handleNewClick("Folder", "Folder")}}>New Folder</MenuItem>
            <MenuItem onClick={() => {handleNewClick("TXT", "Text File")}}>New Text File</MenuItem>
            <MenuItem onClick={() => {handleNewClick("PDF", "PDF File")}}>New PDF File</MenuItem>
            <MenuItem onClick={() => {handleNewClick("IMAGE", "Image")}}>New Image File</MenuItem>
        </Menu>
        {/* Didn't see the point of Modal, and it was harder to use */}
        <Backdrop open = {promptState.open} sx = {{position : "absolute"}}>
            <Paper sx = {{minWidth : "350px", maxWidth : "350px", margin : "auto", textAlign : "center"}}>
                <FileMenuContents 
                    //lots of this will be removed when the "File Transfer" is added
                    promptState = {promptState}
                    handlePointerDown = {handlePointerDown}
                    folderNameInput = {folderNameInput}
                    handleFolderNameInputChange = {handleFolderNameInputChange}
                    preventPositioning = {preventPositioning}
                    cancelBackdrop = {cancelBackdrop}
                    fileSet = {fileSet}
                    uploadFile = {uploadFile}
                    setFileSet = {setFileSet}
                    setUploadFile = {setUploadFile}
                    /*I really don't like this, but since I'm eventually going to remove a lot of this, theres no point in spending time on making an eloquent solution */
                    handleNewFolderClose = {handleNewFolderClose}
                    handleNewTXTClose = {handleNewTXTClose}
                    handleNewPDFClose = {handleNewPDFClose}
                    handleNewImageClose = {handleNewImageClose}
                />
            </Paper>
        </Backdrop>
    </>
    )
}

export default AddFileMenu;