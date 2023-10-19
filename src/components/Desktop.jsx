import React, {useState} from 'react'


//components
import FolderComp from './programs/FileManager/FolderComp'
import FileComp from './programs/FileManager/FileComp'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';

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
       setContextMenu(null);
     };
    /*===============================================================================

        ADDING NEW FILES AND FOLDERS

        this is here just to have functionality. It took like 10-20 minutes to set this up, but there needs to be some major refactoring done
            for both this file and the fileManager
    
    ===============================================================================*/

    const [uploadFile, setUploadFile] = useState(null);
    const [folderNameInput, setFolderNameInput] = useState("");
    const handleFolderNameInputChange = (e) => {
        setFolderNameInput(e.target.value)
    }

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
    const addNewImageFile = () => {
        if (folderNameInput !== "" && uploadFile){
            const data = URL.createObjectURL(uploadFile)
            desktopFolder.addNewFile(folderNameInput, "Image Viewer", data);
            setFileSystemState((prevState) => {return prevState * -1})
        }
        setFolderNameInput("");
    }
    
/*===============================================================================
    ---------------------------------------------------------------------------------
    ===============================================================================*/
    const [modalState, setModalState] = useState({open : false, type : null})

    const newFolderModal = () => {
        handleClose();
        setModalState({open : true, type : "Folder"})
    }
    const newTXTModal = () => {
        handleClose();
        setModalState({open : true, type : "TXT"})
    }
    const newPDFModal = () => {
        handleClose();
        setModalState({open : true, type : "PDF"})
    }
    const newImageModal = () => {
        handleClose();
        setModalState({open : true, type : "IMAGE"})
    }
    const handleNewFolderClose =() => {
        setModalState({open : false, type : null})
        addNewFolder()
    }
    const handleNewTXTClose =() => {
        setModalState({open : false, type : null})
        addNewTxtFile()
    }
    const handleNewPDFClose =() => {
        setModalState({open : false, type : null})
        addNewPDFFile()
    }
    const handleNewImageClose =() => {
        setModalState({open : false, type : null})
        addNewImageFile()
    }
    const chooseModalType = () => {
        if(modalState.type === "Folder")
        {
            return( 
                <div>
                    <p>New Folder Name</p>
                    <input value = {folderNameInput} onChange = {handleFolderNameInputChange}></input>
                    <button onClick = {handleNewFolderClose}>close</button>
                </div>
            )
        }
        else if(modalState.type === "TXT")
        {
            return( 
                <div>
                    <p>New Text File Name</p>
                    <input value = {folderNameInput} onChange = {handleFolderNameInputChange}></input>
                    <button onClick = {handleNewTXTClose}>close</button>
                </div>
            )
        }
        else if(modalState.type === "PDF")
        {
            return( 
                <div>
                    <p>New PDF File Name</p>
                    <input value = {folderNameInput} onChange = {handleFolderNameInputChange}></input>
                    <input type = "file" onChange = {(e) => {setUploadFile(e.target.files[0])}}></input>
                    <button onClick = {handleNewPDFClose}>close</button>
                </div>
            )
        }
        else if(modalState.type === "IMAGE")
        {
            return( 
                <div>
                    <p>New Image File Name</p>
                    <input value = {folderNameInput} onChange = {handleFolderNameInputChange}></input>
                    <input type = "file" onChange = {(e) => {setUploadFile(e.target.files[0])}}></input>
                    <button onClick = {handleNewImageClose}>close</button>
                </div>
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
                overflow : "hidden"
                }}
                onContextMenu={handleContextMenu}
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
                open={contextMenu !== null}
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

            <Backdrop open = {modalState.open} sx = {{position : "absolute"}}>
                    <Paper sx = {{width : "250px", height : "100px", margin : "auto", textAlign : "center"}}>
                        {modalContents}
                    </Paper>
            </Backdrop>
        </>
    )
}
export default Desktop;