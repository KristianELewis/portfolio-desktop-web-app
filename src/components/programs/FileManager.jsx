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

import { fileContext } from '../Context';

//import { Folder, File } from './fileSystem';

import FolderComp from './FolderComp';
import FileComp from './FileComp'

//temporary
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { processManagmentContext } from '../Context'

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

const FileManager = (props) => {

    const { version, loadFile } = props;
    const { addProgram } = useContext(processManagmentContext)


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

    ===============================================================================*/
    const addNewFolder = () => {
        if (folderNameInput !== ""){
            currentFolder.current.addNewFolder(folderNameInput);
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            setFileSystemState((prevState) => {return prevState * -1})
        }
        handleClose();
    }
    const addNewTxtFile = () => {
        if (folderNameInput !== ""){
            //I have to figure something else out about this. File types and process types should not be separated
            currentFolder.current.addNewTxtFile(folderNameInput, "Text Editor");
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            setFileSystemState((prevState) => {return prevState * -1})
        }
        handleClose();
    }

    /*===============================================================================
    ---------------------------------------------------------------------------------
    /*===============================================================================

        CLICK FUNCTIONS

        These can get sent down to the folder or files as the click function.

        Folders will always traverse.

        STANDALONE FILE MANAGER
        ---------------------------------------
        
        -files should create a new program, providing the file type and file data

        ---------------------------------------
        LOAD FILE MANAGER
        ---------------------------------------

        -files should provide file type and file data. File type will verify if its a valid type. Data will then be loaded into the calling process

        ---------------------------------------
        SAVE FILE MANAGER
        ---------------------------------------

        -files will provide file type and file data. File type will verify if its a valid type. Data wont be sent, but instead over written

        ---------------------------------------
    ===============================================================================*/
    
    //traverse a folder. It would be nice to not send this down to files
    const traverse = (id) => {
        const nextFolder = currentFolder.current
        setBackList((prevState) => {
            return [...prevState, nextFolder];
        })
        currentFolder.current = currentFolder.current.traverse(id);
        setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children});
        setForwardList([]);
    }

    const decideFileClickHandler = () => {
        if(version === "Standalone"){
            return addProgram
        }
        else if(version === "Load"){
            return loadFile;
        }
    }
    const fileClickHandler = decideFileClickHandler()

    
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


    return(
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            
                <Paper style = {{height: "100%", position: "relative", overflow: "auto"}}>
                    {/* flex really necesarry here? */}
                    <div style = {{margin : "5px"}}>
                        <IconButton size = "small" onClick = {handleBackwardButton} sx = {{borderRadius : "5px"}} disabled = {backList.length === 0 ? true : false}><ChevronLeftIcon/></IconButton>
                        <IconButton size = "small" onClick = {handleForwardButton} sx = {{marginLeft : "5px", borderRadius : "5px"}} disabled = {forwardList.length === 0 ? true : false}><ChevronRightIcon/></IconButton>
                        <span style = {{marginLeft : "5px", userSelect : "none"}}>
                            {/* menu item? govering diabled?*/}
                            {currentFolderView.fullPath}
                        </span>

                    </div>
                    {/* 
                        for grid rows and columns Ill send down the width and height do a modulus operation
                        And then make a string based of that
                        
                        Or maybe Ill just use flex box again. Flex box is better for dynamic sizes.
                    */}
                    <div onContextMenu={handleContextMenu} style ={{display : "grid", gridTemplateColumns : "100px auto"}}>
                        <div style = {{borderTop: "grey solid 1px", borderBottom: "grey solid 1px"}}>
                            {/* this will be the important folders section thing. quick menu */}
                        </div>
                        <div style = {{border: "grey solid 1px", display : "grid", gridTemplateColumns : "100px 100px", gridTemplateRows : "100px 100px"}}>
                            {/*
                                There Might be a better/faster way to filter and map. Reduce is aparently faster
                                Could maybe filter before hand? First filter out folders. A files array will have faster subseqent filters right?
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
                                    <FileComp 
                                        key = {child.id} 
                                        file = {child}
                                        clickHandler = {fileClickHandler}
                                        />
                                )
                            })}
                        </div>
                    </div>
                    <label>New Folder Name: </label><input value = {folderNameInput} onChange = {handleFolderNameInputChange}></input>

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
                        <MenuItem onClick={addNewFolder}>New Folder</MenuItem>
                        <MenuItem onClick={addNewTxtFile}>New Text File</MenuItem>
                    </Menu>

                </Paper>
        </ThemeProvider>
    )
}

export default FileManager;



/*

 //const {setFile} = props;

    console.log(FileSystem)

    const handleUpload = () => {
        console.log("url made")
        setFile(URL.createObjectURL(thing));

        //localStorage.setItem("file", file)
    }
    const handleDownload = () => {
        console.log("display")
        console.log(file)
        console.log(thing)
        //console.log(localStorage.getItem("file"))
    }
    const handleFileChange = (e) => {
        setThing(e.target.files[0])
        console.log("file changed")
    }

            {/* <input type = {"file"} onChange = {handleFileChange}/>
            <button onClick = {handleUpload}>upload</button>
            <button onClick = {handleDownload}>download</button>
            <img src ={file}></img> 



                //console.log("render")
    //const [file, setFile] = useState(null)
    const [thing, setThing] = useState(null)
*/