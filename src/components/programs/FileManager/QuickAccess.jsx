import React, {useState} from "react";

import Menu from '@mui/material/Menu';
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Typography from '@mui/material/Typography';


const QuickAccessItem = (props) =>{

    const { name, location, quickAccess, id , removeFromQuickAccessList} = props;

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

    const handleRemoveFromQuickAccess = () => {
        removeFromQuickAccessList(id)
    }


    const handleClick =() =>{
        quickAccess(location, id)
    }
    return (
        <>
            <MenuItem onClick = {handleClick} onContextMenu={handleContextMenu}>
                <Typography noWrap >{name}</Typography>
            </MenuItem>

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
                <MenuItem onClick={handleRemoveFromQuickAccess}>Remove From Quick Access</MenuItem>

            </Menu>
        </>
    )
}


const QuickAccess = (props) => {

    const {quickAccessList, quickAccess, removeFromQuickAccessList} = props;
    //remove from quick access will requrie context menu :(
    return (
        <MenuList sx = {{padding : "0px"}}>
            {quickAccessList.map((quickItem) => {
                return(
                    <QuickAccessItem
                        key = {quickItem.key}
                        id = {quickItem.key}
                        name = {quickItem.name}
                        location = {quickItem.location}
                        quickAccess = {quickAccess}
                        removeFromQuickAccessList = {removeFromQuickAccessList}
                    />
                )

            })}
        </MenuList>
    )
}
export default QuickAccess