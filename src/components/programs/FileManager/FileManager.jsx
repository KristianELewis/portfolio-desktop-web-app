/*========================================================================

TODO

    -Probably I should remove the dark theme here and put it further up. Also remove the dark theme from calorie counter

    Don't know how relevant that last comment is.
    This needs to be broken up into a few different components
    Desktop can use those components instead of the horrible way its done now

========================================================================*/

import React, {useState, useContext, useRef, useEffect} from 'react'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Paper from '@mui/material/Paper'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';

import { fileContext } from '../../Context';

//import { Folder, File } from './fileSystem';

import Path from './components/Path'
import QuickAccess from './components/QuickAccess';
import FolderComp from './components/FolderComp';
import FileComp from './components/FileComp';

import { processManagmentContext, programContext, windowWidthContext } from '../../Context'
import TopBarButtons from '../../topBarComponents/TopBarButtons';

const FileManager = () => {

    //Double Click functionality.
    //I don't think it needs to be state. Would work better with a useRef. State would be diffcult to return a value an ensure its been reset before the use click on it
    //Maybe change this to currently clicked/focused or something, and have it highlight the background on a single click
    const doubleClick = useRef({target: null, time : 0})
    const handleDoubleClick = (target) => {
        const newTime = Date.now();
        if(doubleClick.current.target === target && (newTime - doubleClick.current.time < 500))
        {
            doubleClick.current = {target : target, time : newTime}
            return true;
        }
        else{
            doubleClick.current = {target : target, time : newTime}
            return false;
        }
    }

    //used for preventing unwanted repositions
    const preventPositioning = (e) =>{
        e.stopPropagation()
    }

    const { addProgram, editProgram, removeProgram, editProgramFileManager } = useContext(processManagmentContext)
    const programInfo = useContext(programContext);


    const {height} = useContext(windowWidthContext)
    //The top bar has a height of 49px at the moment
    //the content height must be height - 49
    const contentHeight = height - 49;

    const { file, id, name, handlePointerDown, doubleClickResize, handleExit } = programInfo;
    
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


    /*========================================

    TOUCH NONESENE FOR CONTEXT MENU

    ========================================*/
    let timer;
    const touchStart = (e) => {
        const event = {clientX : e.touches[0].clientX, clientY : e.touches[0].clientY, preventDefault : e.preventDefault, stopPropagation : e.stopPropagation}
        timer = setTimeout(() => handleContextMenu(event), 400)
    }
    const touchEnd = () => {
        if(timer){
            clearTimeout(timer);
        }
    }
    //==========================================

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

    //these can be condensed
    const [uploadFile, setUploadFile] = useState(null);
    const [fileSet, setFileSet] = useState(false);

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
    }, [fileSystemState])//why is this a useeffect?

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
                //I have to figure something else out about this. File types and process types should be separated
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
        addNewPDFFile();
        setFileSet(false);
    }
    const handleNewImageClose =() => {
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
    //Theres really only two types of modal/backdrops. Files that just need names, and files that require user upload
    const chooseModalType = () => {
        if(modalState.type === "Folder")
        {
            return( 
                <>
                <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}} onPointerDown = {handlePointerDown}>
                    <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
                    <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}> New Folder</p>
                    <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {handleNewFolderClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
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
                <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}} onPointerDown = {handlePointerDown}>
                    <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
                    <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}> New Text File</p>
                    <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {handleNewTXTClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
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
                <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}} onPointerDown = {handlePointerDown}>
                    <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
                    <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}> New PDF File</p>
                    <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {handleNewPDFClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
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
                <Paper elevation = {3} sx = {{display : "flex", justifyContent : "space-between", alignItems : "center"}} onPointerDown = {handlePointerDown}>
                    <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {cancelBackdrop} sx = {{textTransform: 'none', marginLeft : "7px", marginTop : "7px", marginBottom : "7px"}}>Cancel</Button>
                    <p style = {{margin : "10px", marginBottom : "10px", userSelect : "none"}}>New Image File</p>
                    <Button size = "small" variant = "contained" onPointerDown = {preventPositioning} onClick = {handleNewImageClose} sx = {{textTransform: 'none', marginRight : "7px", marginTop : "7px", marginBottom : "7px"}}>Create</Button>
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

    /*===============================================================================
    ---------------------------------------------------------------------------------
    /*===============================================================================

        FILE MANAGER VERSIONS

        This is explaned in depth in FileComp.jsx and TextEditor.jsx

    ===============================================================================*/

    //may not need requestData
    //This is an issue because filemanager uses file differently than other programs.
    //its causing issues if trying to have a file manager program
    //easiest way to fix this was to add .data to file here and in desktop menu I set the file to data: {object} instead of just {object} 
    const { version, requestID, requestData, acceptableType, programHandler, requestCanceler } = file.data;

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
            //console.log("This file is deleted")
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
            //console.log("This file is deleted")
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

    const handlePointerDownTopBar = (e) => {
        handlePointerDown(e)
        doubleClickResize()
    }
    return(
        <>
        {/*
            Was thinking about moving the topbar back into window, and having programs send the relevant data needed back up to the window component
        */}
        <div style = {{height: "100%", position: "relative", display: "flex", flexDirection : "column", width : "100%"}}>
            {/* flex really necesarry here? */}
            {/*=======================================================
            
            TOP BAR

            =======================================================*/}
            <Paper elevation = {2} sx = {{ flexGrow: 0, display : "flex", alignItems : "center", padding : "5px", borderBottom : "rgb(18, 18, 18) solid 1px", borderRadius : "10px 10px 0 0"}} onPointerDown = {handlePointerDownTopBar}>
                <IconButton size = "small" onClick = {handleBackwardButton} onPointerDown = {preventPositioning} sx = {{borderRadius : "5px"}} disabled = {backList.length === 0 ? true : false}><ChevronLeftIcon/></IconButton>
                <IconButton size = "small" onClick = {handleForwardButton} onPointerDown = {preventPositioning} sx = {{marginLeft : "5px", borderRadius : "5px"}} disabled = {forwardList.length === 0 ? true : false}><ChevronRightIcon/></IconButton>
                
                <Path 
                    path = {currentFolderView.fullPath} 
                    id = {id} 
                    currentFolder = {currentFolder.current} 
                    pathTraverse = {pathTraverse}
                    preventPositioning = {preventPositioning}
                    />
                {/*fileManagerClose is need to close file manager because of requestcanceller */}
                <TopBarButtons program = {1} handleExit = {fileManagerClose} preventPositioning = {preventPositioning}/>
            </Paper>
            {/*=======================================================
                
                MAIN CONTENT


                I need to fix the "middle window" nonsense in window
                Overflow for left an right is broken, the widths arent growing correctly

                    I'm not really sure what I waas talking about in these comments. I thought I needed to fix what ever problem that was before I could work on the overflows here, but that was wrong
                    I may have fixed the issue though. The original overflow was not working correctly and the Paper background was not growing with the overflowing content
                    I switched to using the window height instead of using flexbox
            =======================================================*/}
            <div style ={{display : "grid", gridTemplateColumns : "125px auto", height : contentHeight, boxSizing : "border-box"}}>
                {/*style = {{borderTop: "grey solid 1px", borderRight: "grey solid 1px", height : "100%"}} */}
                <Paper elevation = {1} sx = {{borderRadius : "0 0 0 10px", height : "100%", width : "125px", overflowY : "auto"}}>
                    <QuickAccess 
                        quickAccessList = {quickAccessList}
                        quickAccess = {quickAccess}
                        removeFromQuickAccessList = {removeFromQuickAccessList}
                        />
                </Paper>
                <Paper 
                    onContextMenu = {handleContextMenu} 
                    onTouchStart = {touchStart}
                    onTouchEnd = {touchEnd}
                    onTouchMove = {touchEnd}
                    elevation={0}
                    sx = {{
                        /*borderTop: "grey solid 1px", */
                        borderRadius : "0 0 10px 0",
                        overflow : "auto", 
                        height : "100%"
                    }}
                    >
                    {/*
                        There Might be a better/faster way to filter and map. Reduce is aparently faster
                        Could maybe filter before hand? First filter out folders. A files array will have faster subseqent filters right?
                        
                        Actually it might be better to have a if statement/switch statment to decide what the files should be.
                        
                        Might want these files arranged in alphabetic order as well. Maybe I can add some filtering options in the future

                        No reason to filter and map this. Children should be sorted in whatever way it is and then just map children

                        not sure if this filter is even done right, Should it even be return nothing?
                        I will remove this empty return statement later, I want to do it while watching memory to see what effect it has on it
                    */}
                    <div style = {{
                        display : "flex", 
                        flexBasis : "100px", 
                        flexFlow : "row wrap",  
                        alignContent : "start" }}
                        >
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
                                    handleDoubleClick = {handleDoubleClick}
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
                                    handleDoubleClick = {handleDoubleClick}
                                    />
                            )
                        })}
                    </div>
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
            <Paper sx = {{minWidth : "350px", maxWidth : "350px", margin : "auto", textAlign : "center"}}>
                {modalContents}
            </Paper>
        </Backdrop>
        </>
    )
}

export default FileManager;