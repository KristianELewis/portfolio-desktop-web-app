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


//temporary
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
/*========================================================================

TODO

for now I will just use an iframe, It seems to work well. Just need to put a transparent div in front of the iframe when moving or resizing 

This file should be improved whem a file/folder system is implemented

Whenm no pdf is loaded, I need to have some sort of menu system to load a pdf from the programs local files

========================================================================*/


//This shouldnt load files like this in the future. need to get the files from public or local storage when I figure out how that works

const FileManager = (props) => {

    const {addProgram} = props;
    /*From the material ui demo */
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


    const [backList, setBackList] = useState([]);

    const [forwardList, setForwardList] = useState([]);

    //console.log("render")
    const [folderNameInput, setFolderNameInput] = useState("");
    const {FileSystem, fileSystemState, setFileSystemState} = useContext(fileContext)
    //console.log(fileSystemState)

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
            currentFolder.current.addNewTxtFile(folderNameInput, "TXT");
            setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children})
            setFileSystemState((prevState) => {return prevState * -1})
        }
        handleClose();
    }

    const handleFolderNameInputChange = (e) => {
        setFolderNameInput(e.target.value)
    }

    const traverse = (ID) => {
        //console.log("traversing")
        const nextFolder = currentFolder.current
        setBackList((prevState) => {
            return [...prevState, nextFolder];
        })
        currentFolder.current = currentFolder.current.traverse(ID);
        setCurrentFolderView({name: currentFolder.current.name, fullPath: currentFolder.current.fullPath, children : currentFolder.current.children});
        setForwardList([]);
        //setFileSystemState((prevState) => {return prevState * -1})
    }

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
                    */}
                    <div onContextMenu={handleContextMenu} style ={{display : "grid", gridTemplateColumns : "100px auto"}}>
                        <div style = {{borderTop: "grey solid 1px", borderBottom: "grey solid 1px"}}>
                            {/* this will be the important folders section thing. quick menu */}
                        </div>
                        <div style = {{border: "grey solid 1px", display : "grid", gridTemplateColumns : "100px 100px", gridTemplateRows : "100px 100px"}}>
                            {currentFolderView.children.map((child) => {
                                return (
                                    <FolderComp 
                                        key = {child.ID} 
                                        ID = {child.ID} 
                                        name = {child.name} 
                                        traverse = {traverse} 
                                        type = {child.type} 
                                        addProgram = {addProgram}
                                        file = {child}
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