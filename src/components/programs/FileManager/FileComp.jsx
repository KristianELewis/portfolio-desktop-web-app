import React, {useState} from 'react'

import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
//import IconButton from '@mui/material/IconButton';

/*
    I would like for this to be more generic, but Im having issues with maintaining accurate state while passing functions

    I think It would be easiest to have different versions for each filemanager. Maybe in the future there can be more generoc components with
    small more specific sub components

*/

const Folder = (props) => {
    const { 
        file, 
        addProgram, 
        editProgram, 
        removeProgram, 
        editProgramFileManager,
        version, 
        requestID, 
        requestData, 
        acceptableType, 
        programHandler,
        fileManagerId
        } = props;

    const {id, name, type} = file

    const [isHovering, setIsHovering] = useState(false);

    const iconDecider = () => {
        if(type === "Text Editor")
        {
            return <TextSnippetIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
        else if(type === "PDF Viewer")
        {
            return <PictureAsPdfIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
        else if(type === "Image Viewer")
        {
            return <ImageIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
    }
    const icon = iconDecider();

    //instead of addProgram, it could be "clickFunction"
    //depending on the type of file manager we are using, it could be a load function, an add program function, or a save function

    /*
        Both load and save from file will load this file into the calling program.

        Then load and save file will have separate functions from their own comonents that probably could just be called here

        Then this program will shut itself down


    */

    // else if(version === "Load"){
    //     programHandler();
    // }
    // else if(version === "Save"){
    //     //return editProgram;
    //    programHandler();
    // }
    const handleClick = () => {
        if(version === "Standalone"){ //If this is a standalone file manager it should just add a new program
            addProgram(type, file)
        }
        else if (version === "SetBackground" && acceptableType === type){
            programHandler(type, file);
            removeProgram(fileManagerId);
        }
        else if(acceptableType === type) //If this filetype  is compatible with the calling program
        {
            /*
                editProgram followed by removeProgram will cause issues.
                The remove program will undo edit program.
                The quick fix is to just make a new function specifically for this instance
            */
            programHandler(type, file); // then it should call the function inside the program which will take over from there
            editProgramFileManager(requestID, fileManagerId, file)
            //editProgram(requestID, file) //This will set the calling functions file to this
            //The parameters for programHandler could probably change
            //removeProgram(fileManagerId);// then it should remove itself //This is screwing things up I'm pretty sure

        }
        //clickHandler(type, file)
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

            {icon}
            
            <p style = {{margin: "0px", userSelect: "none"}}>{ name }</p>
        </div>
    )
}

export default Folder;

/* Might bring this back. Files are close enough that they probably could share the same component

*/