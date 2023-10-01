import React from 'react'
import ReactDOM from 'react-dom';



/* 
    Using draft js
    seems a little excesive and annoying to use, I may change it/make my own

*/
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

function MyEditor() {
    const [editorState, setEditorState] = React.useState( () => EditorState.createEmpty(), );
    return <Editor editorState={editorState} onChange={setEditorState} />;
}

const TextEditor = () => {

    return(
        <div style = {{padding: "10px", backgroundColor : "yellow", height : "100%"}}>
            <MyEditor> </MyEditor>
        </div>
    )
}

export default TextEditor;