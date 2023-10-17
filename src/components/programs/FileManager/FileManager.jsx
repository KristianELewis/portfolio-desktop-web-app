/*========================================================================

TODO

    -In the future the top bar path should have each folder as a clickable element. Then the program will traverse to that folder
    -Probably I should remove the dark theme here and put it further up. Also remove the dark theme from calorie counter

========================================================================*/

import React, {useState, useContext, useRef, useEffect} from 'react'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Paper from '@mui/material/Paper'

//import Button from '@mui/material/Button';
//import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';


import { fileContext } from '../../Context';

//import { Folder, File } from './fileSystem';

import FolderComp from './FolderComp';
import FileComp from './FileComp'

//temporary


import { processManagmentContext, programContext } from '../../Context'



const FileManager = (props) => {

    //const { version, clickFunction } = props;
    const { addProgram, editProgram, removeProgram, editProgramFileManager } = useContext(processManagmentContext)

    const programInfo = useContext(programContext);

    const { file, id, name, handleMouseDown, handleExit } = programInfo;
    
    /*From the material ui demo ---------------------------------------*/
    const [contextMenu, setContextMenu] = React.useState(null);
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
    /* End of material ui demo stuff -----------------------------------*/


    const [backList, setBackList] = useState([]);
    const [forwardList, setForwardList] = useState([]);

    const [folderNameInput, setFolderNameInput] = useState("");
    const handleFolderNameInputChange = (e) => {
        setFolderNameInput(e.target.value)
    }

    const {FileSystem, fileSystemState, setFileSystemState} = useContext(fileContext)
    const [uploadFile, setUploadFile] = useState(null);

    const currentFolder = useRef(FileSystem)
    const [currentFolderView, setCurrentFolderView] = useState({name: FileSystem.name, fullPath: currentFolder.current.fullPath, children : FileSystem.children});
    /*
        Not sure if this is the best way to implement a filesystem.

        In my mind, the filesystem isn't immutable, and it isnt tied to rendering

        oh no, i need state

        this is a temporary fix, I should probably do this differently

        If Im basically using a flag for rerender, do I need the currentFolderView state at all?
    */
    useEffect(() => {
        setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
    }, [fileSystemState])

    /*===============================================================================

        ADDING NEW FILES AND FOLDERS

        -So much of this is generic and the same, This can be cutdown for sure
            -This is low priority at the moment but it should be done before any more file types are added
    
    ===============================================================================*/
    const addNewFolder = () => {
        if (folderNameInput !== ""){
            currentFolder.current.addNewFolder(folderNameInput);
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            setFileSystemState((prevState) => {return prevState * -1})
        }
        setFolderNameInput("");
    }
    const addNewTxtFile = () => {
        if (folderNameInput !== ""){
            //I have to figure something else out about this. File types and process types should be separated
            currentFolder.current.addNewFile(folderNameInput, "Text Editor", null);
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
    const addNewImageFile = () => {
        if (folderNameInput !== "" && uploadFile){
            const data = URL.createObjectURL(uploadFile)
            //I have to figure something else out about this. File types and process types should be separated
            currentFolder.current.addNewFile(folderNameInput, "Image Viewer", data);
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
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

    /*===============================================================================
    ---------------------------------------------------------------------------------
    /*===============================================================================

        FILE MANAGER VERSIONS

        This is explaned in depth in FileComp.jsx and TextEditor.jsx

    ===============================================================================*/

    //may not need requestData
    const { version, requestID, requestData, acceptableType, programHandler, requestCanceler } = file;

    //traverse a folder
    const traverse = (id) => {
        const nextFolder = currentFolder.current
        setBackList((prevState) => {
            return [...prevState, nextFolder];
        })
        currentFolder.current = currentFolder.current.traverse(id);
        setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children});
        setForwardList([]);
    }

    const fileManagerClose = () => {
        if(requestCanceler !== null)
        {
            requestCanceler();
        }
        handleExit();
    }
    /*===============================================================================
    ---------------------------------------------------------------------------------
    /*===============================================================================

        FORWARD AND BACKWARD BUTTONS

    ===============================================================================*/
    //raverse is the reverse of traverse. Probably should not keep this name
    const handleBackwardButton = () => {
        const nextFolder = currentFolder.current
        setForwardList((prevState) => {
            return [...prevState, nextFolder];
        })
        currentFolder.current = backList[backList.length - 1]
        setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
        setBackList((prevState) => {
            //should remove last element in the arry
            return prevState.slice(0, -1);
        })
    }
    const handleForwardButton = () => {
        const nextFolder = currentFolder.current
        setBackList((prevState) => {
            return [...prevState, nextFolder];
        })
        currentFolder.current = forwardList[forwardList.length - 1]
        setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
        setForwardList((prevState) => {
            //should remove last element in the arry
            return prevState.slice(0, -1);
        })
    }
    /*===============================================================================
    ---------------------------------------------------------------------------------
    ===============================================================================*/

    //used for preventing un wanted repositions
    const preventPositioning = (e) =>{
        e.stopPropagation()
    }

    return(
        <>
            
                {/* The overflow auto should be moved further down soon.
                    Will need to get window dimensions and set the max height of the content based on that - the top bar height

                    not sure if its more cursed but I could send the top bar up a level instead
                */}
                <Paper style = {{height: "100%", position: "relative", display: "flex", flexDirection : "column", overflow : "auto"}}>
                    {/* flex really necesarry here? */}
                    <div style = {{margin : "5px", flexGrow: 0, display : "flex", justifyContent : "space-between", alignItems : "center"}} onMouseDown = {handleMouseDown}>
                        <div>
                        <IconButton size = "small" onClick = {handleBackwardButton} onMouseDown = {preventPositioning} sx = {{borderRadius : "5px"}} disabled = {backList.length === 0 ? true : false}><ChevronLeftIcon/></IconButton>
                        <IconButton size = "small" onClick = {handleForwardButton} onMouseDown = {preventPositioning} sx = {{marginLeft : "5px", borderRadius : "5px"}} disabled = {forwardList.length === 0 ? true : false}><ChevronRightIcon/></IconButton>
                        
                        <span style = {{marginLeft : "5px", userSelect : "none"}}>
                            {/* menu item? govering diabled?*/}
                            {currentFolderView.fullPath} : {id}
                        </span>
                        </div>
                        <CloseIcon 
                            sx = {{
                                color : "white",
                                "&:hover": { backgroundColor: "black" }
                            }}
                            onClick = {fileManagerClose}
                            onMouseDown = {preventPositioning}
                        />
                    </div>
                    {/* 
                        for grid rows and columns Ill send down the width and height do a modulus operation
                        And then make a string based of that
                        
                        Or maybe Ill just use flex box again. Flex box is better for dynamic sizes.
                    */}
                    <div onContextMenu={handleContextMenu} style ={{display : "grid", gridTemplateColumns : "100px auto", flexGrow : 1, boxSizing : "border-box"}}>
                        <div style = {{borderTop: "grey solid 1px", borderBottom: "grey solid 1px"}}>
                            {/* this will be the important folders section thing. quick menu */}
                        </div>
                        <div style = {{border: "grey solid 1px", display : "flex", flexBasis : "100px", flexFlow : "row wrap", flexGrow : 0, alignContent : "start", minHeight : "100%"}}>
                            {/*
                                There Might be a better/faster way to filter and map. Reduce is aparently faster
                                Could maybe filter before hand? First filter out folders. A files array will have faster subseqent filters right?
                                
                                Actually it might be better to have a if statement/switch statment to decide what the files should be.
                                
                                Might want these files arranged in alphabetic order as well. Maybe I can add some filtering options in the future
                            */}
                            {currentFolderView.children.filter(child => {
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
                                        traverse = {traverse} 
                                        />
                                )
                            })}
                            {/*Files Gettin non no ids for files?>*/}
                            {currentFolderView.children.filter(child => {
                                if(child.type !== "Folder")
                                {
                                    return child;
                                }
                                return
                            }).map((child) => {
                                return (
                                    //clickHandler = {fileClickHandler}
                                    <FileComp 
                                        key = {child.id} 
                                        file = {child}
                                        addProgram = {addProgram}
                                        editProgram = {editProgram}
                                        removeProgram = {removeProgram}
                                        editProgramFileManager = {editProgramFileManager}
                                        version = {version}
                                        requestID = {requestID}
                                        requestData = {requestData}
                                        acceptableType = {acceptableType}
                                        programHandler = {programHandler}
                                        fileManagerId = {id}
                                        />
                                )
                            })}
                        </div>
                    </div>

                    {/*From the material ui demo */}
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

                </Paper>
                {/* Didn't see the point of Modal, and it was harder to use */}
                <Backdrop open = {modalState.open} sx = {{position : "absolute"}}>
                    <Paper sx = {{width : "250px", height : "100px", margin : "auto", textAlign : "center"}}>
                        {modalContents}
                    </Paper>
                </Backdrop>
                </>
    )
}

export default FileManager;