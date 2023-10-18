import React from "react";

import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Typography from '@mui/material/Typography';


const QuickAccessItem = (props) =>{

    const { name, location, quickAccess } = props;

    const handleClick =() =>{
        quickAccess(location)
    }
    return (
        <MenuItem onClick = {handleClick}>
            <Typography noWrap >{name}</Typography>
        </MenuItem>
    )
}


const QuickAccess = (props) => {

    const {quickAccessList, quickAccess} = props;

    return (
        <MenuList sx = {{padding : "0px"}}>
            {quickAccessList.map((quickItem) => {
                return(
                    <QuickAccessItem
                        key = {quickItem.key}
                        name = {quickItem.name}
                        location = {quickItem.location}
                        quickAccess = {quickAccess}
                    />
                )

            })}
        </MenuList>
    )
}
export default QuickAccess