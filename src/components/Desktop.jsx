import React, {useState} from 'react'

//components
import FolderComp from './programs/FileManager/FolderComp'
import FileComp from './programs/FileManager/FileComp'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';

import Popover from '@mui/material/Popover';

const Desktop = (props) => {
    const {
        desktopFolder, 
        addProgram,
        editProgram,
        removeProgram,
        editProgramFileManager,
        handleFolderClick,
        setFileSystemState,
        addToQuickAccessList
     } = props
    /*==================================================================

    context menu

    not so sure about all this

    ==================================================================*/
    const [contextMenu, setContextMenu] = useState(null);
    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
            ? {
                mouseX: event.clientX,
                mouseY: event.clientY,
                }
            : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                // Other native context menus might behave different.
                // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
        };
    const handleClose = () => {
        //could potentially cause issues
        setModalState({open : false, type : null})
        setContextMenu(null);
    };

    /*========================================

    TOUCH NONESENE FOR CONTEXT MENU

    ========================================*/
    let timer;
    const touchStart = (e) => {
        const event = {clientX : e.touches[0].clientX, clientY : e.touches[0].clientY, preventDefault : e.preventDefault}
        timer = setTimeout(() => handleContextMenu(event), 1000)
    }
    const touchEnd = () => {
        if(timer){
            clearTimeout(timer);
        }
    }
    /*===============================================================================

        ADDING NEW FILES AND FOLDERS

        this is here just to have functionality. It took like 10-20 minutes to set this up, but there needs to be some major refactoring done
            for both this file and the fileManager
    
    ===============================================================================*/
    const [uploadFile, setUploadFile] = useState(null);
    const [fileSet, setFileSet] = useState(false);


    const [folderNameInput, setFolderNameInput] = useState("");
    const handleFolderNameInputChange = (e) => {
        setFolderNameInput(e.target.value)
    }
    //============================================================================
    const addNewFolder = () => {
        if (folderNameInput !== ""){
            desktopFolder.addNewFolder(folderNameInput);
            setFileSystemState((prevState) => {return prevState * -1})
        }
        setFolderNameInput("");
    }
    const addNewTxtFile = () => {
        if (folderNameInput !== ""){
            desktopFolder.addNewFile(folderNameInput, "Text Editor", null);
            setFileSystemState((prevState) => {return prevState * -1})
        }
        setFolderNameInput("");
    }
        
    const addNewPDFFile = () => {
        if (folderNameInput !== "" && uploadFile){
            const data = URL.createObjectURL(uploadFile)
            desktopFolder.addNewFile(folderNameInput, "PDF Viewer", data);
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
                desktopFolder.addNewFile(folderNameInput, "Image Viewer", data);
                setFileSystemState((prevState) => {return prevState * -1})
            })
        }
        setFolderNameInput("");
    }

/*===============================================================================
    ---------------------------------------------------------------------------------
    ===============================================================================*/
    const [modalState, setModalState] = useState({open : false, type : null})

    const newFolderModal = () => {
        //handleClose();
        setModalState({open : true, type : "Folder"})
    }
    const newTXTModal = () => {
        //handleClose();
        setModalState({open : true, type : "TXT"})
    }
    const newPDFModal = () => {
        //handleClose();
        setModalState({open : true, type : "PDF"})
    }
    const newImageModal = () => {
        //handleClose();
        setModalState({open : true, type : "IMAGE"})
    }
    const handleNewFolderClose =() => {
        setModalState({open : false, type : null})
        addNewFolder()
        handleClose();
    }
    const handleNewTXTClose =() => {
        setModalState({open : false, type : null})
        addNewTxtFile()
        handleClose();
    }
    const handleNewPDFClose =() => {
        setModalState({open : false, type : null})
        addNewPDFFile()
        handleClose();
        setFileSet(false);
    }
    const handleNewImageClose =() => {
        setModalState({open : false, type : null})
        addNewImageFile()
        handleClose();
        setFileSet(false);
    }
    const cancelBackdrop = () => {
        setUploadFile(null);
        setFileSet(false);
        setFolderNameInput("");
        setModalState({open : false, type : null})
    }
    const chooseModalType = () => {
        if(modalState.type === "Folder")
        {
            return( 
                <>
                <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}}>
                    <Button size = "small" variant = "contained" onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
                    <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}> New Folder</p>
                    <Button size = "small" variant = "contained" onClick = {handleNewFolderClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
                </Paper>
                <div style = {{textAlign : "left", padding : "16px", width : "100%"}}>
                    <p style = {{marginTop : "0px", marginBottom : "2px", fontSize : "14px"}}>Folder Name</p>
                    <TextField size = "small" fullWidth value = {folderNameInput} onChange = {handleFolderNameInputChange} inputProps = {{style : {height : "16px"}}}></TextField>
                </div>
                </>
            )
        }
        else if(modalState.type === "TXT")
        {
            return( 
                <>
                <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}}>
                    <Button size = "small" variant = "contained" onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
                    <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}> New Text File</p>
                    <Button size = "small" variant = "contained" onClick = {handleNewTXTClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
                </Paper>
                <div style = {{textAlign : "left", padding : "16px", width : "100%"}}>
                    <p style = {{marginTop : "0px", marginBottom : "2px", fontSize : "14px"}}>Text File Name</p>
                    <TextField size = "small" fullWidth value = {folderNameInput} onChange = {handleFolderNameInputChange} inputProps = {{style : {height : "16px"}}}></TextField>
                </div>
                </>
            )
        }
        else if(modalState.type === "PDF")
        {
            return( 
                <>
                <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}}>
                    <Button size = "small" variant = "contained" onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
                    <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}> New PDF File</p>
                    <Button size = "small" variant = "contained" onClick = {handleNewPDFClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
                </Paper>
                <div style = {{textAlign : "left", padding : "16px", width : "100%"}}>
                    <p style = {{marginTop : "0px", marginBottom : "2px", fontSize : "14px"}}>PDF File Name</p>
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
        else if(modalState.type === "IMAGE")
        {
            return( 
                <>
                <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}}>
                    <Button size = "small" variant = "contained" onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
                    <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}>New Image File</p>
                    <Button size = "small" variant = "contained" onClick = {handleNewImageClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
                </Paper>
                <div style = {{textAlign : "left", padding : "16px", width : "100%"}}>
                    <p style = {{marginTop : "0px", marginBottom : "2px", fontSize : "14px"}}>New Image Name</p>
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
                                type = "file"
                                accept = "image/*"
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
        else if(modalState.type === null)
        {
            return( 
                <div width = {"100px"}>

                </div>
            )
        }
    }
    const modalContents = chooseModalType();

    return (
        <>
            <div style = {{ 
                display : "flex", 
                flexBasis : "100px", 
                flexDirection : "column",  
                flexFlow : "column wrap", 
                flexGrow : 0, 
                alignContent : "start", 
                minHeight : "100%", 
                maxHeight : "100%", 
                overflow : "hidden",
                }}
                onContextMenu = {handleContextMenu}
                onTouchStart = {touchStart}
                onTouchEnd = {touchEnd}
            >
                {desktopFolder.children.filter(child => {
                    if(child.type === "Folder")
                    {
                        return child;
                    }
                    return
                    }).map((child) => {
                        return (
                            <FolderComp 
                                key = {child.id} 
                                file = {child}
                                traverse = {handleFolderClick}
                                setFileSystemState = {setFileSystemState}
                                addToQuickAccessList = {addToQuickAccessList}
                                />
                        )
                    })}
                    {/*Files Gettin non no ids for files?>*/}
                {desktopFolder.children.filter(child => {
                    if(child.type !== "Folder")
                    {
                        return child;
                    }
                    return
                }).map((child) => {
                    return (
                        //Most of this stuff is no necessary for desktop
                        <FileComp 
                            key = {child.id} 
                            file = {child}
                            addProgram = {addProgram}
                            editProgram = {editProgram}
                            removeProgram = {removeProgram}
                            editProgramFileManager = {editProgramFileManager}
                            version = {"Standalone"}
                            requestID = {null}
                            requestData = {null}
                            acceptableType = {null}
                            programHandler = {null}
                            fileManagerId = {null}
                            setFileSystemState = {setFileSystemState}
                            />
                    )
                })}
            </div>

            <Menu
                open={!modalState.open && contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
                }
            >
                <MenuItem onClick={newFolderModal}>New Folder</MenuItem>
                <MenuItem onClick={newTXTModal}>New Text File</MenuItem>
                <MenuItem onClick={newPDFModal}>New PDF File</MenuItem>
                <MenuItem onClick={newImageModal}>New Image File</MenuItem>

            </Menu> 

            <Popover
                open={modalState.open}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
                }
            >
                <Paper sx = {{minWidth : "350px", maxWidth : "350px", margin : "auto", textAlign : "center", padding : "0px"}}>
                    {modalContents}
                </Paper>
            </Popover>
        </>
    )
}
export default Desktop;