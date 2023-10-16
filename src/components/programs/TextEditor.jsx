import React, {useState, useContext}from 'react'

import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop'

import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
//import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


import FileManager from './FileManager';

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
    const programInfo = useContext(programContext);

    const { file, id, name, handleMouseDown, handleExit } = programInfo;
    const {editProgram} = processManagmentInfo;

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

    const [fileManagerState, setFileManagerState] = useState({open: false, type : null})

    //file management will be a backdrop I think. Might as well just have it freeze the whole screen
    const handleSaveData = (type, file) => {
        if(type === "Text Editor")
        {
            file.data = value;
            editProgram(id, file);
            setFileManagerState({open : false, type : null})
        }
    }
    const saveData = () => {
        if(file)
        {
            file.data = value;
        }
        else{
            setFileManagerState({open : true, type : "Save"})
        }
        setFilesAnchor(null)
    }

    const handleLoadFile = (type, file) => {
        if(type === "Text Editor")
        {
            editProgram(id, file);
            editor.children = file.data
            setValue(file.data);
            setFileManagerState({open : false, type : null})
        }
    }
    const loadFile = () => {
        setFileManagerState({open : true, type : "Load"})
        setFilesAnchor(null)
    }

    const [editor] = useState(() => withReact(createEditor()))

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
    //perhaps move this div into the window
    //draftjs will not allow overflow on x

    //not sure if its neccesary to have these separated. I think It was causeing issues before. Ill look into later I just needd to get this working
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
        {/* <div className = "windowTopBar" 
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

        </div> */}
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
        <div style = {{height: "100%", overflow: 'auto', color : "black"}}>

            {/*just put the slate shit here */}
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

            {/* definetly needs some styleing but its working so far */}
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
      </div>
      </>
    )
}

export default TextEditor;