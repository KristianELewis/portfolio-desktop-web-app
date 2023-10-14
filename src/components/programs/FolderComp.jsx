import React, {useState} from 'react'

import FolderIcon from '@mui/icons-material/Folder';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
//import IconButton from '@mui/material/IconButton';



const Folder = (props) => {
    const {ID, name, traverse, type, addProgram, file} = props;

    const [isHovering, setIsHovering] = useState(false);

    const handleClick = () => {
        if (type === "Folder")
        {
            traverse(ID);
        }
        else
        {
            addProgram("Text Editor", file)
        }
    }
    
    const iconDecider = (type) => {
        if(type === "Folder")
        {
            return <FolderIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
        else if(type === "TXT")
        {
            return <TextSnippetIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
    }

    const handleMouseEnter = () => {
        setIsHovering(true)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
    }
    const icon = iconDecider(type);
    
    /*border : "solid black 1px",*/
    /*cursor : isHovering ? "pointer" : "default",*/
    return (
        <div
            style = {{
                textAlign : "center", 
                width : "90px", 
                height : "90px", 
                borderRadius : "10px", 
                margin: "10px",
                backgroundColor : isHovering ? "rgba(255, 255, 255, 0.08)" : "transparent"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            >
            {/*icon here soon */}
            {icon}
            
            <p style = {{margin: "0px", userSelect: "none"}}>{ name }</p>
        </div>
    )
}

export default Folder;

//<div style ={{width : "50px", height : "50px", backgroundColor :  margin : "auto", marginTop : "10px"}}></div>