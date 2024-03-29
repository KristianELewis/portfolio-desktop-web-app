/*===========================================================================
    TODO

    -The drop down menu goes outside of the window if the height is too short. I'm pretty sure i can eith confine it or use a different dropdown menu

    -FileManagement has a few things todo, they are described in its explanation

    -This should be split up some more. The actual TextEditor should be moved into its own file. The lazy loading shoudl be moved into this file and taken out of window



    From What I remember this was sort of hacked together quickly. I should review it. Maybe after I have a more solid file system
===========================================================================*/


import React, {useState, useContext}from 'react'

import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import TopBarButtons from '../topBarComponents/TopBarButtons';

import { programContext, processManagmentContext } from '../Context';

const TextEditor = () => {
    const processManagmentInfo = useContext(processManagmentContext);
    const {editProgram, addProgram, removeProgram, programs} = processManagmentInfo;

    const programInfo = useContext(programContext);
    const { file, id, name, handlePointerDown, doubleClickResize, handleExit} = programInfo;

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

    /*===========================================================================

    View fileComp.jsx for more explanation


    FILE MANAGEMENT

        EXPLANATION

        -A file manager program will be opened, it will be given the correct type (load, save, backgroundChange)
            -Its id will be set the currentFolderId, which will prevent another filemanager from opening from the calling program
        -The file manager will set the file of the calling function to a whichever file the user chooses
        -The file manager will then call a function that was passed to it
            -This function will handle the calling programs data management
                -in the case of saving, the program will save its contents to the newly aquired files data
                -in the case of loading, the program will load the data from the newly aquire file
                -All functionality will set currentfolderId to null, which will allow it to open a new file manager
        -The file manager will close its self

        -The file manager also checks to make sure the file type and the program are compatible
        -The file manager also is provided with a requestCanceler function
            -This function will be called if the file manager is manually closed
            -It will set the programs currentFolderId to null, allowing the program to open a new filemanager

        THINGS TO ADD

        -disable texteditor when filemanager is open
            -changing text editor when file manager is open might cause problems,
                it also may have been fixed with the new implemenation, but It should still be disabled anyway

        -when the editor closes the file manager should also be removed
            -this is probably a pretty easy fix, may do this before next commit

        -type parameter in the programHandler frunctions can be removed, file compatibilty is checked inside the File Comp
            -It would also be nice if I could do something about the file being passed around
                -it seems unecessary especially in the pdf and image viewers that do nothing with the passed file
                -Something needs to change about it though, Im also  sending an unecessary programData down to the fileManager
                    -This could be used by save functionality, but right now its useless
    ===========================================================================*/

    const [currentFolderId, setCurrentFolderId] = useState(null)
    const requestCanceler = () => {
        setCurrentFolderId(null)
    }
 //------------------------------------------------------------------------------------------------------------------
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
    const handleSaveData = (type, file) => {
        if(type === "Text Editor")
        {
            file.data = value;
        }
        setCurrentFolderId(null)
    }
    const saveData = () => {
        if(file)
        {
            file.data = value;
        }
        else if(currentFolderId === null){
            setCurrentFolderId(addProgram("File Manager", {data :{
                version : "Save", 
                requestID : id, 
                requestData : null, 
                acceptableType : "Text Editor", 
                programHandler : handleSaveData,
                requestCanceler : requestCanceler
        }}))
        }
        setFilesAnchor(null)
    }
//------------------------------------------------------------------------------------------------------------------
    const handleLoadFile = (type, file) => {
        if(type === "Text Editor")
        {
            editor.children = file.data
            //I can see some possible issues arising here. We are changing the state of the program right before calling this function.
            //It seems to be okay at the moment
            setValue(file.data);
        }
        setCurrentFolderId(null)
    }
    const loadFile = () => {
        if(currentFolderId === null){
            setCurrentFolderId(addProgram("File Manager", {data :{
                version : "Load", 
                requestID : id, 
                requestData : null, 
                acceptableType : "Text Editor", 
                programHandler : handleLoadFile,
                requestCanceler : requestCanceler
        }}))
        }
        setFilesAnchor(null)
    }

/*===========================================================================
-----------------------------------------------------------------------------
===========================================================================*/

    //perhaps move this div into the window
    //draftjs will not allow overflow on x
    //not sure if its neccesary to have these separated. I think It was causeing issues before. Ill look into later I just needd to get this working

    //I no longer have any idea what these comments are talking about

    const [filesAnchor, setFilesAnchor] = useState(null);
    const fileOpen = Boolean(filesAnchor);
    const handleFilesClick = (e) => {
        setFilesAnchor(e.currentTarget)
    }
    const handleCloseFiles = () => {
        setFilesAnchor(null)
    }

    //I dont need this in its own function really, its more to remind myself.
    //Putting this in on Pointer downs in topbar buttons and such will prevent unwanted repositions
    const preventPositioning = (e) =>{
        e.stopPropagation()
    }
    const handlePointerDownTopBar = (e) => {
        handlePointerDown(e)
        doubleClickResize()
    }
    return(
        <div className = "windowMidContainer" style = {{width : "100%"}}>
            {/*currentFolderId !== null && <div style = {{height : "100%", width : "100%", backgroundColor : "black", position: "absolute"}}/>
            The idea for this was to make the text editor disabled. Not a bad Idea to just implement it like this
            */}
            <Paper 
                position = "relative" 
                sx = {{
                    height : "40px", 
                    padding: "0 5px 0 5px", 
                    boxSizing : "border-box", 
                    borderRadius : "10px 10px 0 0" , 
                    display : "grid", 
                    gridTemplateColumns : "1fr 1fr 1fr", 
                    alignItems : "center"
                    }} 
                onPointerDown = {handlePointerDownTopBar}
            >
                    <Button size = "small" color = 'inherit' onClick = {handleFilesClick} onPointerDown = {preventPositioning} sx = {{justifySelf : "flex-start", textTransform : "none", fontSize : "16px", padding : "0"}}>Files</Button>
                    <Menu
                        anchorEl={filesAnchor}
                        open = {fileOpen}
                        onClose ={handleCloseFiles}
                        onPointerDown = {preventPositioning}
                    >
                        <MenuItem onClick={newFile}>New File</MenuItem>
                        <MenuItem onClick={saveData}>Save File</MenuItem>
                        <MenuItem onClick={loadFile}>Load File</MenuItem>
                    </Menu>

                    <Typography noWrap sx = {{width : "100%", textAlign : "center", userSelect : "none", justifySelf: "center"}}>{file ? file.name : "new file"}</Typography>
                    <TopBarButtons program = {6} handleExit = {handleExit} preventPositioning = {preventPositioning}/>
            </Paper>
            <div style = {{overflow: 'auto', borderRadius : "0 0 10px 10px"}}>
                <Slate editor={editor} initialValue={value} value={value} onChange = {handleChange}>
                    <Editable style = {{
                        color : "white",
                        backgroundColor : "rgb(18, 18, 18)", 
                        minHeight : "100%", 
                        minWidth : "100%", 
                        padding: "5px", 
                        boxSizing: "border-box", 
                        display: "inline-block", 
                        whiteSpace: "pre"
                    }}/>
                </Slate>
            </div>
        </div>
    )
}

export default TextEditor;