import React, {useState} from 'react'

import FolderIcon from '@mui/icons-material/Folder';
//import IconButton from '@mui/material/IconButton';



const Folder = (props) => {
    const { traverse, file} = props;

    const {id, name, type} = file

    const [isHovering, setIsHovering] = useState(false);

    //a lot of these things feel like they could just be apart of the file itself
    const handleClick = () => {
        traverse(id);
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

            <FolderIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
            
            <p style = {{margin: "0px", userSelect: "none"}}>{ name }</p>
        </div>
    )
}

export default Folder;


/*Don't think I need this anymore.
    //maybe in the future I can use this functionality to display an empty folder, vs a filled folder
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
    const icon = iconDecider(type);
*/
//<div style ={{width : "50px", height : "50px", backgroundColor :  margin : "auto", marginTop : "10px"}}></div>