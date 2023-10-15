import React, {useState, useContext}from 'react'

import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop'

import FileManager from './FileManager';

import { programContext } from '../Context';
/*

  */

const TextEditor = (props) => {
    const {editProgram} = props;

    const programInfo = useContext(programContext);

    const { file, id } = programInfo;

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
    const saveData = () => {
        if(file)
        {
            file.data = value;
        }
        //need to open file managment
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
        //Will need to load in the file manager
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
    }
    //perhaps move this div into the window
    //draftjs will not allow overflow on x

    //not sure if its neccesary to have these separated. I think It was causeing issues before. Ill look into later I just needd to get this working
    const chooseFileManager = () => {
        if(fileManagerState.type === "Load")
        {
            return <FileManager version = "Load" loadFile = {handleLoadFile}/>
        }
        else {
            return <></>
        }
    };
    const fileManager = chooseFileManager();

    const handleCancel = () => {
        setFileManagerState({open : false, type : null})
    }
    return(
        <div style = {{height: "100%", overflow: 'auto', color : "black"}}>
            <AppBar position = "relative" >
                <ButtonGroup variant="contained">
                    <Button onClick = {newFile} size = "small">new</Button>
                    <Button onClick = {saveData} size = "small">save</Button>
                    <Button onClick = {loadFile} size = "small">load</Button>
                    <Typography>{file ? file.name : "new file"}</Typography>
                </ButtonGroup>
            </AppBar>
            {/*just put the slate shit here */}
            <Slate editor={editor} initialValue={value} value={value} onChange = {handleChange}>
                <Editable style = {{
                    backgroundColor : "white", 
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
                <div>
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
    )
}

export default TextEditor;