import React, {useState} from "react";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper'


import NewSimpleMenu from './NewSimpleMenu';
import NewComplexFile from './NewComplexFile';


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
    const [modalState, setModalState] = useState({open : false, type : null})
    //If handleNewClick is given an invalid type it breaks. Should never happen, but something to remember for potential changes/refactors
    const handleNewClick = (type) => {
        handleCloseContextMenu(); //Closes the context menu
        setModalState({open : true, type : type})
    }

    const handleNewFolderClose = () => {
        setModalState({open : false, type : null})
        addNewFolder()
    }
    const handleNewTXTClose = () => {
        setModalState({open : false, type : null})
        addNewTxtFile()
    }
    const handleNewPDFClose =() => {
        setModalState({open : false, type : null})
        addNewPDFFile();
        setFileSet(false);
    }
    const handleNewImageClose = () => {
        setModalState({open : false, type : null})
        addNewImageFile();
        setFileSet(false);
    }
    const cancelBackdrop = () => {
        setUploadFile(null);
        setFileSet(false);
        setFolderNameInput("");
        setModalState({open : false, type : null})
    }
    //I can see how this can somewhat easily be refactored to be more generic.
    //Theres really only two types of modal/backdrops. Files that just need names, and files that require user upload'
    console.log(modalState)
    const chooseModalType = () => {
        if(modalState.type === "Folder")
        {
            return( 
                <NewSimpleMenu 
                    handlePointerDown = {handlePointerDown}
                    name = {"Folder"}
                    folderNameInput = {folderNameInput}
                    handleFolderNameInputChange = {handleFolderNameInputChange}
                    handleNewFolderClose = {handleNewFolderClose}
                    preventPositioning = {preventPositioning}
                    cancelBackdrop = {cancelBackdrop}
                />
            )
        }
        else if(modalState.type === "TXT")
        {
            return( 
                <NewSimpleMenu 
                    handlePointerDown = {handlePointerDown}
                    name = {"Text File"}
                    folderNameInput = {folderNameInput}
                    handleFolderNameInputChange = {handleFolderNameInputChange}
                    handleNewFolderClose = {handleNewTXTClose}
                    preventPositioning = {preventPositioning}
                    cancelBackdrop = {cancelBackdrop}
                />
            )
        }
        else if(modalState.type === "PDF")
        {
            return( 
                <NewComplexFile
                    handlePointerDown = {handlePointerDown}
                    name = {"PDF File"}
                    folderNameInput = {folderNameInput}
                    handleFolderNameInputChange = {handleFolderNameInputChange}
                    handleClose = {handleNewPDFClose}
                    preventPositioning = {preventPositioning}
                    cancelBackdrop = {cancelBackdrop}
                    fileSet = {fileSet}
                    uploadFile = {uploadFile}
                    setFileSet = {setFileSet}
                    setUploadFile = {setUploadFile}
                />
            )
        }
        else if(modalState.type === "IMAGE")
        {
            return( 
                <NewComplexFile
                    handlePointerDown = {handlePointerDown}
                    name = {"Image"}
                    folderNameInput = {folderNameInput}
                    handleFolderNameInputChange = {handleFolderNameInputChange}
                    handleClose = {handleNewImageClose}
                    preventPositioning = {preventPositioning}
                    cancelBackdrop = {cancelBackdrop}
                    fileSet = {fileSet}
                    uploadFile = {uploadFile}
                    setFileSet = {setFileSet}
                    setUploadFile = {setUploadFile}
                />
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
            <MenuItem onClick={() => {handleNewClick("Folder")}}>New Folder</MenuItem>
            <MenuItem onClick={() => {handleNewClick("TXT")}}>New Text File</MenuItem>
            <MenuItem onClick={() => {handleNewClick("PDF")}}>New PDF File</MenuItem>
            <MenuItem onClick={() => {handleNewClick("IMAGE")}}>New Image File</MenuItem>
        </Menu>
        {/* Didn't see the point of Modal, and it was harder to use */}
        <Backdrop open = {modalState.open} sx = {{position : "absolute"}}>
            <Paper sx = {{minWidth : "350px", maxWidth : "350px", margin : "auto", textAlign : "center"}}>
                {modalContents}
            </Paper>
        </Backdrop>
    </>
    )
}

export default AddFileMenu;