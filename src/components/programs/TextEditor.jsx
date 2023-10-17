import React, {useState, useContext}from 'react'

import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
//import Backdrop from '@mui/material/Backdrop'

import Paper from '@mui/material/Paper'
//import Toolbar from '@mui/material/Toolbar'
//import AppBar from '@mui/material/AppBar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
//import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


//import FileManager from './FileManager/FileManager';

import { programContext, processManagmentContext } from '../Context';
/*
    TODO

    App Bar doesnt really work the way I want it to. It might be better to use a Paper component and just set a good height.

    I don't like the color scheme either I dont think. Its comming out blue, not sure if dark mode will make a difference

    This drop down menu goes outside of the window if the height is too short. I'm pretty sure i can eith confine it or use a different dropdown menu

*/

const TextEditor = (props) => {
    //const {editProgram} = props;

    const processManagmentInfo = useContext(processManagmentContext);
    const {editProgram, addProgram, removeProgram, programs} = processManagmentInfo;

    const programInfo = useContext(programContext);
    const { file, id, name, handleMouseDown, handleExit } = programInfo;

    const loadData = () => {
        if(file){
            return file.data
        }
        else{
            return [
                {
                  type: 'paragraph',
                  children: [{ text: '' }],
                },
              ]
        }
    }

    const initalValue = loadData() //pretty sure I can just put this function in the state init
    const [value, setValue] = useState(initalValue)
    const handleChange = (newValue) => { setValue(newValue) }
    const [editor] = useState(() => withReact(createEditor()))

    //console.log(programs)
/*===========================================================================

    FILE MANAGEMENT

    -this is working for the most part right now. There is some wonkiness when changing the text when a load or save file manager is up
        specifically changing the inner text when a save file manager is loaded seems to break it. If there is a way to disable the text editor while
        a file manager is active (currentFolderID !== null) that would be good.
        A temporary fix would to just put a dim backdrop colored div overtop of the window when current folderID is not null
        or maybe just making the files button disabled

    -if you close the file manager with the x button it will break the program. currentFolderID wont be removed
        A fix for this would to be to pass a "cancel handler"
        cancel handler would be difined in the calling omponent, from the calling component the file manager would be deleted and also current foldder Id would be set to null

    -when the editor closes the file maaager should also be removed

    -Using contexts and stuff is not working well maybe should stop
        editing programs will remove anything made after the file manager was opened and also the file manager
        trying to remove the file managger is also stuck in the past and will set this program to its old version, deleting the file info

    -So its sort of working now, but its giving warnging about trying to render screen an texteditor at the same time
        definitly from the if statment



        NEW IDEA    

        Instead of sending down functions for the folder to enact, you send down this processes ID
        Then from within the file manager you edit the program state of THIS TEXT EDITOR
        You exit the file manager from there too

        Inside here after that is done, we need to allow file manger to be accessed again
        we need to set values if necessary

        SO for save you need to send down the file information
        The file manager will edit the data for the file, and then set this programs file to that file

        Both load and save might need to rely on a use effect, When the file changes all the values and stuff change as well,
        it also means that the currentfolder should change.


        So I need to make specific file manager types I think, then I can come back here and fix this shit
===========================================================================*/

    const [currentFolderId, setCurrentFolderId] = useState(null)
    //const [newFileInfo, setNewFileInfo] = useState(null)

    // if(newFileInfo !== null)
    // {
    //     const {type, file} = newFileInfo
    //     if(type === "Text Editor"){
    //         editProgram(id, file);
    //     }
    //     //removeProgram(currentFolderId)
    //     setCurrentFolderId(null)
    //     setNewFileInfo(null)
    // }
    const requestCanceler = () => {
        setCurrentFolderId(null)
    }
    const newFile = () => {
        editor.children = [ //this won't cause a reRender
            {
                type: "paragraph",
                children: [{ text: '' }]
            }
        ];
        editProgram(id, null) //But this will. Not sure If its a problem or not. Seems fine to me
        setFilesAnchor(null)
    }
//------------------------------------------------------------------------------------------------------------------
    //The first part should still work

    //I could likely remove the parameters, especially the type parameter.
    //The only reason I wouldnt remove the file parameter is that its possible that the file for this program has not be set yet
    const handleSaveData = (type, file) => {
        if(type === "Text Editor")
        {
            file.data = value;
            //editProgram(id, file);
        }
        setCurrentFolderId(null)
        //setNewFileInfo({type: type, file : file})
        //removeProgram(currentFolderId)
        //setCurrentFolderId(null)
    }
    const saveData = () => {
        if(file)
        {
            file.data = value;
        }
        else if(currentFolderId === null){
            setCurrentFolderId(addProgram("File Manager", {
                version : "Save", 
                requestID : id, 
                requestData : null, 
                acceptableType : 
                "Text Editor", 
                programHandler : handleSaveData,
                requestCanceler : requestCanceler
            }))
        }
        setFilesAnchor(null)
    }
//------------------------------------------------------------------------------------------------------------------
    const handleLoadFile = (type, file) => {
        if(type === "Text Editor")
        {
            //editProgram(id, file);
            editor.children = file.data
            //I can see some possible issues arising here. We are changing the state of the program right before calling this function.
            //setValue(file.data);
        }
        setCurrentFolderId(null)
        //setNewFileInfo({type: type, file : file})
        //removeProgram(currentFolderId)
        //setCurrentFolderId(null)
    }
    const loadFile = () => {
        if(currentFolderId === null){
            //setCurrentFolderId(addProgram("File Manager", {version : "Load", clickFunction : handleLoadFile}))
            setCurrentFolderId(addProgram("File Manager", {
                version : "Load", 
                requestID : id, 
                requestData : null, 
                acceptableType : "Text Editor", 
                programHandler : handleLoadFile,
                requestCanceler : requestCanceler
            }))

        }
        setFilesAnchor(null)
    }

/*===========================================================================
-----------------------------------------------------------------------------
===========================================================================*/

    //perhaps move this div into the window
    //draftjs will not allow overflow on x
    //not sure if its neccesary to have these separated. I think It was causeing issues before. Ill look into later I just needd to get this working

    //I no longer have any idea what these comments are talking abour



    const [filesAnchor, setFilesAnchor] = useState(null);
    const fileOpen = Boolean(filesAnchor);
    const handleFilesClick = (e) => {
        setFilesAnchor(e.currentTarget)
    }
    const handleCloseFiles = () => {
        setFilesAnchor(null)
    }

    //I dont need this in its own function really., it more to remind myself. Putting this in on mouse downs in topbar buttons and such will prevent unwanted repositions
    const preventPositioning = (e) =>{
        e.stopPropagation()
    }
    return(
        <>
        {/*currentFolderId !== null && <div style = {{height : "100%", width : "100%", backgroundColor : "black", position: "absolute"}}/>*/}
        <Paper position = "relative" sx = {{height : "40px", display : "flex", justifyContent : "space-between", alignItems : "center"}} onMouseDown = {handleMouseDown}>
                <Button color = 'inherit' onClick = {handleFilesClick} onMouseDown = {preventPositioning}>Files</Button>
                <Menu
                    anchorEl={filesAnchor}
                    open = {fileOpen}
                    onClose ={handleCloseFiles}
                    onMouseDown = {preventPositioning}
                >
                    <MenuItem onClick={newFile}>New File</MenuItem>
                    <MenuItem onClick={saveData}>Save File</MenuItem>
                    <MenuItem onClick={loadFile}>Load File</MenuItem>
                </Menu>

                <Typography sx = {{userSelect : "none"}}>{file ? file.name : "new file"}</Typography>
                <Typography sx = {{userSelect : "none"}}>{id}</Typography>
                <CloseIcon 
                    sx = {{
                        color : "white",
                        "&:hover": { backgroundColor: "black" }
                    }}
                    onClick = {handleExit}
                    onMouseDown = {preventPositioning}
                />
        </Paper>
        <div style = {{height: "100%", overflow: 'auto'}}>
            <Slate editor={editor} initialValue={value} value={value} onChange = {handleChange}>
                <Editable style = {{
                    color : "white",
                    backgroundColor : "rgb(18, 18, 18)", 
                    minHeight : "100%", 
                    minWidth : "100%", 
                    padding: "3px", 
                    boxSizing: "border-box", 
                    display: "inline-block", 
                    whiteSpace: "pre"
                }}/>
            </Slate>
      </div>
      </>
    )
}

export default TextEditor;


/*
    old folder management bsck drop system
            <Backdrop open = {fileManagerState.open}>
                <div style ={{width : "500px", height : "500px"}}>
                    <AppBar position = "relative" >

                        <ButtonGroup variant="contained">
                            <Button onClick = {handleCancel} size = "small">Cancel</Button>
                            <Button onClick = {handleCancel} size = "small">Load</Button>
                        </ButtonGroup>
                    </AppBar>

                    {fileManager}
                </div>
            </Backdrop> 

            //file management will be a backdrop I think. Might as well just have it freeze the whole screen

    const [fileManagerState, setFileManagerState] = useState({open: false, type : null})

    const chooseFileManager = () => {
        if(fileManagerState.type === "Load")
        {
            return <FileManager version = "Load" clickFunction = {handleLoadFile}/>
        }
        if(fileManagerState.type === "Save")
        {
            return <FileManager version = "Save" clickFunction = {handleSaveData}/>
        }
        else {
            return <></>
        }
    };
    const fileManager = chooseFileManager();
    const handleCancel = () => {
        setFileManagerState({open : false, type : null})
    }



    /* <div className = "windowTopBar" 
            onMouseDown = {handleMouseDown} 
        >
            <Typography sx = {{userSelect: "none"}}>{name}</Typography>
            <CloseIcon 
                sx = {{
                    color : "white",
                    "&:hover": { backgroundColor: "black" }
                }}
                onClick = {handleExit}
            />
        ;

        </div> 
*/