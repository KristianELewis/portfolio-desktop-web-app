import React, {useState} from 'react'

import FolderIcon from '@mui/icons-material/Folder';
//import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


const Folder = (props) => {
    const { traverse, file, FileSystem, setFileSystemState, addToQuickAccessList, handleDoubleClick } = props;
    const {id, name, type, fullPath} = file
    const [isHovering, setIsHovering] = useState(false);

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
        //console.log(FileSystem)
        file.beginSelfDeletion()
        setFileSystemState((prevState) => {return prevState * -1})
        handleClose()
    }
    const addToQuickAccess = () => {
        //console.log("Quick Access")
        addToQuickAccessList({location : file, key : fullPath + id, name : name})
        handleClose();
    }
    /*===========================================================
    -------------------------------------------------------------
    ===========================================================*/



    const handleClick = () => {
        if (handleDoubleClick(file)){
            traverse(id);
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
                width : "100px", 
                height : "100px", 
                borderRadius : "10px", 
                margin: "5px",
                overflow: "clip",
                backgroundColor : isHovering ? "rgba(255, 255, 255, 0.08)" : "transparent"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onContextMenu={handleContextMenu} //right click context menu
            onTouchStart = {touchStart}
            onTouchEnd = {touchEnd}
            onTouchMove = {touchEnd}
            >

            <FolderIcon fontSize = "large" sx ={{width : "50px", height : "50px", marginTop : "5px"}}/>
            
            <p style = {{
                    margin: "0px", 
                    userSelect: "none", 
                    textShadow: "1px 1px 2px #000000",
                    fontSize: "14px",
                    maxWidth: "100px",
                    maxHeight: "45px",
                    lineHeight: "17px",
                    textOverflow: "ellipsis"
                    }}>{ name }</p>
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
            <MenuItem onClick={handleDelete}>Delete Folder</MenuItem>
            <MenuItem onClick={addToQuickAccess}>Add to quick access</MenuItem>

        </Menu>
    </>
    )
}

export default Folder;
