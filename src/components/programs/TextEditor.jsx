import React, {useState}from 'react'
import ReactDOM from 'react-dom';

import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'


const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]
  
const MyComponent = () => {
    const [editor] = useState(() => withReact(createEditor()))
    return (
      // Add the editable component inside the context.
      <Slate editor={editor} initialValue={initialValue} >
        <Editable style = {{
            backgroundColor : "white", 
            minHeight : "100%", 
            minWidth : "100%", 
            padding: "3px", 
            boxSizing: "border-box", 
            display: "inline-block", 
            whiteSpace: "nowrap"
        }}/>
      </Slate>
    )
}

const TextEditor = () => {

    //perhaps move this div into the window
    //draftjs will not allow overflow on x
    return(
        <div style = {{height: "100%", overflow: 'auto'}}>
            <MyComponent> </MyComponent>
        </div>
    )
}

export default TextEditor;




/* 
    Using draft js
    seems a little excesive and annoying to use, I may change it/make my own

*/
/*
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

function MyEditor() {
    const [editorState, setEditorState] = React.useState( () => EditorState.createEmpty(), );
    return <Editor editorState={editorState} onChange={setEditorState} />;
}


const TextEditor = () => {

    //perhaps move this div into the window
    //draftjs will not allow overflow on x
    return(
        <div style = {{backgroundColor : "yellow", height: "100%", overflow: 'auto'}}>
            <MyEditor> </MyEditor>
        </div>
    )
}

*/