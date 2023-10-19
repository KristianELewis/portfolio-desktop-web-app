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

import Path from './Path'
import QuickAccess from './QuickAccess';
import FolderComp from './FolderComp';
import FileComp from './FileComp';

import { processManagmentContext, programContext } from '../../Context'

const FileManager = (props) => {

    //const { version, clickFunction } = props;
    const { addProgram, editProgram, removeProgram, editProgramFileManager } = useContext(processManagmentContext)

    const programInfo = useContext(programContext);

    const { file, id, name, handleMouseDown, handleExit } = programInfo;
    
    /*From the material ui demo ---------------------------------------*/
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
    /* End of material ui demo stuff -----------------------------------*/

    const [backList, setBackList] = useState([]);
    const [forwardList, setForwardList] = useState([]);

    const [folderNameInput, setFolderNameInput] = useState("");
    const handleFolderNameInputChange = (e) => {
        setFolderNameInput(e.target.value)
    }

    const {
        FileSystem, 
        fileSystemState, 
        setFileSystemState, 
        quickAccessList, 
        addToQuickAccessList, 
        removeFromQuickAccessList
    } = useContext(fileContext)

    const [uploadFile, setUploadFile] = useState(null);
    const currentFolder = useRef(FileSystem)
    //Hmmm these values are FileSystem except on e is currentFolder. This should be fixed
    //Maybe i can improve starting location functionality and have this use that as its default state
    //Do I even need this state here?
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

    /*
    if(currentFolder.current === null)
    {
        console.log("I don't think this should happen")
    }
    */

    //This fixes the issue of deleted folders being the currently viewed folder
    if(currentFolder.current.dirty === true)
    {
        //console.log("Dirty")
        //If the current folder has been deleted then reset to home. This should be enough
        //I wonder if I should set the dirty bit to null at some point, or if it doesnt eally matter. Are Bools an object?
        currentFolder.current = FileSystem;
        setCurrentFolderView({name: FileSystem.name, fullPath: FileSystem.fullPath, children : FileSystem.children})
    }
    else
    {
        //console.log("Not Dirty")
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


        Need to make sure the previous or next folder is not deleted (null)

    ===============================================================================*/
    //raverse is the reverse of traverse. Probably should not keep this name
    const handleBackwardButton = () => {
        const nextFolder = currentFolder.current
        setForwardList((prevState) => {
            return [...prevState, nextFolder];
        })
        currentFolder.current = backList[backList.length - 1]
        if(currentFolder.current.dirty === true){ //If the next folder is already deleted
            //reset to home
            currentFolder.current = FileSystem;
            //this could probably be done outside the if statement, its the same for both branches
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            //empty backList
            setBackList([])
            //This should probably inform the user with a backdrop in the future
            console.log("BackwardButton: Folder was deleted")

        }
        else {
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            setBackList((prevState) => {
                //should remove last element in the arry
                return prevState.slice(0, -1);
            })
        }
    }
    const handleForwardButton = () => {
        const nextFolder = currentFolder.current
        setBackList((prevState) => {
            return [...prevState, nextFolder];
        })
        currentFolder.current = forwardList[forwardList.length - 1]

        if(currentFolder.current.dirty === true){ //If the next folder is already deleted
            //reset to home
            currentFolder.current = FileSystem;
            //this could probably be done outside the if statement, its the same for both branches
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            //empty forwardList
            setForwardList([])
            //This should probably inform the user with a backdrop in the future
            console.log("ForwardButton: Folder was deleted")
        }
        else{
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            setForwardList((prevState) => {
                //should remove last element in the arry
                return prevState.slice(0, -1);
            })
        }

    }
    /*===============================================================================
    ---------------------------------------------------------------------------------
    /*===============================================================================

        QUICK ACCESS FUNCTIONALITY

    ===============================================================================*/

    const traverseByFolder = (destinationFolder) =>{
        currentFolder.current = destinationFolder;
        setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children});
    }

    const quickAccess = (destinationFolder, key) => {
        if(destinationFolder.dirty === true){
            //again probably should use a back drop for this
            console.log("This file is deleted")
            removeFromQuickAccessList(key)
        }
        else{
            const prevFolder = currentFolder.current
            if(currentFolder.current !== destinationFolder)
            {
                setBackList((prevState) => {
                    return [...prevState, prevFolder];
                })
                setForwardList([]);
                traverseByFolder(destinationFolder)
            }
        }
    }

    //this is almost exactly the same as quickAccess
    const pathTraverse = (destinationFolder) => {
        if(destinationFolder.dirty === true){
            //again probably should use a back drop for this
            //If this is true then the current path is probably deleted too, this should probably not even happen with the way deleted files are handled by fileManager
            console.log("This file is deleted")
        }
        else{
            const prevFolder = currentFolder.current
            setBackList((prevState) => {
                return [...prevState, prevFolder];
            })
            setForwardList([]);
            traverseByFolder(destinationFolder)
        }
    }

    useEffect(() => {
        if(requestData !== null)
        {
            traverseByFolder(requestData);
        }
    }, [])

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
                <div style = {{height: "100%", position: "relative", display: "flex", flexDirection : "column", width : "100%"}}>
                    {/* flex really necesarry here? */}
                    <Paper elevation = {2} sx = {{ flexGrow: 0, display : "flex", alignItems : "center", padding : "5px", borderBottom : "rgb(18, 18, 18) solid 1px", borderRadius : "5px 5px 0 0"}} onMouseDown = {handleMouseDown}>
                            <IconButton size = "small" onClick = {handleBackwardButton} onMouseDown = {preventPositioning} sx = {{borderRadius : "5px"}} disabled = {backList.length === 0 ? true : false}><ChevronLeftIcon/></IconButton>
                            <IconButton size = "small" onClick = {handleForwardButton} onMouseDown = {preventPositioning} sx = {{marginLeft : "5px", borderRadius : "5px"}} disabled = {forwardList.length === 0 ? true : false}><ChevronRightIcon/></IconButton>
                           
                            <Path 
                                path = {currentFolderView.fullPath} 
                                id = {id} 
                                currentFolder = {currentFolder.current} 
                                pathTraverse = {pathTraverse}
                                preventPositioning = {preventPositioning}
                                />
                            
                        <CloseIcon 
                            sx = {{
                                color : "white",
                                marginLeft : "5px",
                                "&:hover": { backgroundColor: "black" }
                            }}
                            onClick = {fileManagerClose}
                            onMouseDown = {preventPositioning}
                        />
                    </Paper>
                    {/* 
                        Need to get overflow working individually for each of these two containers

                        Okay before I start trying to get overflow working in here, I need to fix the "middle window" nonsense in window
                        That file needs some serious refactor, and cleanup
                        Overflow for left an right is broken, the widths arent growing correctly

                        The flex box stuff here needs to be cleaened up. Theres too many flex containers
                    */}
                    <div style ={{display : "grid", gridTemplateColumns : "125px auto", flexGrow : 1, boxSizing : "border-box", overflow : "auto"}}>
                        {/*style = {{borderTop: "grey solid 1px", borderRight: "grey solid 1px", height : "100%"}} */}
                        <Paper elevation = {1} sx = {{borderRadius : "0 0 0 5px", height : "100%"}}>
                            <QuickAccess 
                                quickAccessList = {quickAccessList}
                                quickAccess = {quickAccess}
                                removeFromQuickAccessList = {removeFromQuickAccessList}
                                />
                        </Paper>
                        <Paper 
                            onContextMenu={handleContextMenu} 
                            elevation={0}
                            sx = {{
                                /*borderTop: "grey solid 1px", */
                                borderRadius : "0 0 5px 0",
                                display : "flex", 
                                flexBasis : "100px", 
                                flexFlow : "row wrap", 
                                flexGrow : 0, 
                                alignContent : "start", 
                                minHeight : "100%"
                            }}>
                            {/*
                                There Might be a better/faster way to filter and map. Reduce is aparently faster
                                Could maybe filter before hand? First filter out folders. A files array will have faster subseqent filters right?
                                
                                Actually it might be better to have a if statement/switch statment to decide what the files should be.
                                
                                Might want these files arranged in alphabetic order as well. Maybe I can add some filtering options in the future

                                No reason to filter and map this. Children should be sorted in whatever way it is and then just map children

                                not sure if this filter is even done right, Should it even be return nothing?
                                I will remove this empty return statement later, I want to do it while watching memory to see what effect it has on it
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
                                        FileSystem = {FileSystem}
                                        setFileSystemState = {setFileSystemState}
                                        addToQuickAccessList = {addToQuickAccessList}
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
                                        setFileSystemState = {setFileSystemState}
                                        />
                                )
                            })}
                        </Paper>
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

                </div>
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