import React, {useState}from 'react'

import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

/*
const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]
  */
const MyComponent = (props) => {
    const {initValue, handleChange} = props;



    const [editor] = useState(() => withReact(createEditor()))
    return (
      // Add the editable component inside the context.
      <Slate editor={editor} initialValue={initValue} onChange = {handleChange}>
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
    )
}

const TextEditor = (props) => {
    const {file} = props;

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
    const initalValue = loadData()
    const [value, setValue] = useState(initalValue)
    const handleChange = (newValue) => {
        setValue(newValue)
    }

    const saveData = () => {
        if(file)
        {
            file.data = value;
        }
    }

    const loadFile = () => {

    }

    const newFile = () => {

    }
    //perhaps move this div into the window
    //draftjs will not allow overflow on x
    return(
        <div style = {{height: "100%", overflow: 'auto', color : "black"}}>
            <AppBar position = "relative" >
                <ButtonGroup variant="contained">
                    <Button onClick = {newFile} size = "small">new</Button>
                    <Button onClick = {saveData} size = "small">save</Button>
                    <Button onClick = {loadFile} size = "small">load</Button>

                </ButtonGroup>
            </AppBar>
            
            <MyComponent initValue = {initalValue} handleChange = {handleChange}> </MyComponent>
        </div>
    )
}

export default TextEditor;