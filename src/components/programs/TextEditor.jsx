import React, {useState}from 'react'

import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'


const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
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
            whiteSpace: "pre"
        }}/>
      </Slate>
    )
}

const TextEditor = () => {

    //perhaps move this div into the window
    //draftjs will not allow overflow on x
    return(
        <div style = {{height: "100%", overflow: 'auto', color : "black"}}>
            <MyComponent> </MyComponent>
        </div>
    )
}

export default TextEditor;