import React, {useState} from 'react'

import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import CalculateIcon from '@mui/icons-material/Calculate';
import TerminalIcon from '@mui/icons-material/Terminal';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
//import IconButton from '@mui/material/IconButton';

/*
    I would like for this to be more generic, but Im having issues with maintaining accurate state while passing functions

    I think It would be easiest to have different versions for each filemanager. Maybe in the future there can be more generoc components with
    small more specific sub components

*/

const FileComp = (props) => {
    //some of these are useless, or could be condesed/cut down in some way
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
        fileManagerId,
        setFileSystemState
        } = props;

    const {id, name, type} = file

    const [isHovering, setIsHovering] = useState(false);



    //this should be refactored. should be a state or something. No reason to run this everytime the component is rerendered
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
        else if(type === "File Manager") //I think I'm gonna switch to a lookup table or something
        {
            return <FolderSpecialIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
        else if(type === "Calorie Counter") //I think I'm gonna switch to a lookup table or something
        {
            return <img src="CalorieCounterLogo50.png" alt="Calorie Counter" width="50px" height="50px" style = {{marginTop : "5px"}}></img>
            //return <TerminalIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
        else if(type === "PianoSynthJS") //I think I'm gonna switch to a lookup table or something
        {
            return <img src="PianoSynthApp.png" alt="PianoSynthJS" width="50px" height="50px" style = {{marginTop : "5px"}}></img>
            //return <TerminalIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
        else if(type === "Calculator") //I think I'm gonna switch to a lookup table or something
        {
            return <CalculateIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
        else// if(type === "Program") //I think I'm gonna switch to a lookup table or something
        {
            return <TerminalIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
        }
    }
    //never need to reset this, so maybe useRef instead or someting
    const [icon, setIcon] = useState(iconDecider())
    //const icon = iconDecider();
    /*===========================================================

    CONTEXT MENU

    ===========================================================*/
    const [contextMenu, setContextMenu] = useState(null);
    const handleContextMenu = (event) => {
      event.preventDefault();
      event.stopPropagation(); //prevents the file managers context menu
      setContextMenu(
        contextMenu === null ? {
              mouseX: event.clientX,
              mouseY: event.clientY,
            }
          : 
            null,
      );
    };
    const handleClose = () => {
      setContextMenu(null);
    };


    /*========================================

    TOUCH NONESENE FOR CONTEXT MENU

    ========================================*/
    let timer;
    const touchStart = (e) => {
        e.stopPropagation();
        const event = {clientX : e.touches[0].clientX, clientY : e.touches[0].clientY, preventDefault : e.preventDefault, stopPropagation : e.stopPropagation}
        timer = setTimeout(() => handleContextMenu(event), 400)
    }
    const touchEnd = () => {
        if(timer){
            clearTimeout(timer);
        }
    }
    //==========================================

    const handleDelete = () => {
        //console.log("Delete File")
        //console.log("id: " + id)
        //console.log("name: " + id)
        file.beginSelfDeletion()
        setFileSystemState((prevState) => {return prevState * -1})
        handleClose()
    }
    const addToQuickAccess = () => {
        //console.log("Quick Access")
        handleClose();
    }
    /*===========================================================
    -------------------------------------------------------------
    ===========================================================*/

    /*===========================================================================

        View textEditor.jsx for more explanation

        FILE MANAGER VERSION FUNCTIONALITY

        -The file manager may be a few different versions
            -standalone
            -setbackground
                -this is for desktop background picture
            -save
            -load

        -standalone version will just open a new program corresponding to the file type, with the file as the file loaded in the program

        -setbackground picture will send the file to the caller (should really only be DesktopMenu) and then closes itself
            -maybe eventually I can have a right click option for files to do this as well

        -Both save and load can be handled the same way here
            -It calls the calling programs passed handler function with this file provided
                -The program will set its internal state this if necessary
                -It will also set its currentFileMangerId to null, allowing it to open another fileManger
            -It will then call the the program state function, this There is a special program state function specifically for save and load functionality
                -It will set the programs file to this file, it will then close this fileManager
                -this needs to be done in the same state setter. editProgram and removeProgram will interfere with each othere if they are called one after another

    ===========================================================================*/
    const handleClick = () => {
        if(version === "Standalone"){ //If this is a standalone file manager it should just add a new program
            console.log(type)
            console.log(file)
            addProgram(type, file)
        }
        else if (version === "SetBackground" && acceptableType === type){
            programHandler(type, file);
            removeProgram(fileManagerId);
        }
        else if(acceptableType === type) //If this filetype is compatible with the calling program
        {
            programHandler(type, file);
            editProgramFileManager(requestID, fileManagerId, file)
        }
    }

    const handleMouseEnter = () => {
        setIsHovering(true)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
    }


    return (
        <>
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
                onContextMenu={handleContextMenu}
                onTouchStart = {touchStart}
                onTouchEnd = {touchEnd}
                onTouchMove = {touchEnd}
                >

                {icon}
                
                <p style = {{margin: "0px", userSelect: "none"}}>{ name }</p>
            </div>

            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
                }
                >
                <MenuItem onClick={handleDelete}>Delete File</MenuItem>
                {/* Not sure about adding files to quickAccess
                    it also is not even implemented yet
                    <MenuItem onClick={addToQuickAccess}>Add to quick access</MenuItem>
                */}

            </Menu>
        </>
    )
}

export default FileComp;