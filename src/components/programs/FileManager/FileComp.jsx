import React, {useState} from 'react'

import TextSnippetIcon from '@mui/icons-material/TextSnippet';
//import IconButton from '@mui/material/IconButton';



const Folder = (props) => {
    const { clickHandler, file} = props;

    const {id, name, type} = file

    const [isHovering, setIsHovering] = useState(false);

    //instead of addProgram, it could be "clickFunction"
    //depending on the type of file manager we are using, it could be a load function, an add program function, or a save function
    const handleClick = () => {
        clickHandler(type, file)
    }

    const handleMouseEnter = () => {
        setIsHovering(true)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
    }
    

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

            <TextSnippetIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
            
            <p style = {{margin: "0px", userSelect: "none"}}>{ name }</p>
        </div>
    )
}

export default Folder;

/* Might bring this back. Files are close enough that they probably could share the same component
    const iconDecider = (type) => {
        if(type === "Folder")
        {
            return <FolderIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
        else if(type === "TXT")
        {
            return 
        }
    }
    const icon = iconDecider(type);
*/