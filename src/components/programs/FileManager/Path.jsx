import React from 'react';

import MenuList from "@mui/material/MenuList";
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const PathItem = (props) => {

    const {name, pathItem, pathTraverse} = props;
    const handleClick = () => {
        pathTraverse(pathItem)
    }

    return(
        <>
            <span style = {{paddingLeft: "7px" , paddingRight: "7px"}}>/</span>
            <MenuItem 
                onClick = {handleClick} 
                sx = {{
                    display: "inline-block", 
                    borderRadius : "5px", 
                    boxSizing: "border-box",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                    marginLeft : "2px",
                    marginRight : "2px"
                }}>
                <Typography sx = {{boxSizing: "border-box", maxWidth : "100px"}} noWrap>{name}</Typography>
            </MenuItem>
            {/*This might be better as typography */}
        </>
    )
}

const Path = (props) => {
    const { path, id, currentFolder, pathTraverse } = props;

    let tempFolder = currentFolder.parent;
    let pathList = [];
    while(tempFolder != null){
        pathList.push(tempFolder);
        tempFolder = tempFolder.parent;
    }

    return (
        <Paper variant = "outlined" sx = {{ maxHeight : "38px", direction: "rtl", textAlign : "left", width : "100%", overflow : "hidden" }}>
            <div style = {{ maxHeight : "38px", whiteSpace : "nowrap"}}>
                <MenuList sx = {{padding : "0px"}}>
                    <Typography sx = {{
                            display: "inline-block", 
                            boxSizing: "border-box", 
                            maxWidth : "132px", 
                            userSelect : "none", 
                            verticalAlign: "middle",
                            paddingLeft: "16px",
                            paddingRight: "16px",
                            paddingTop: "6px",
                            paddingBottom: "6px"
                            }} 
                            noWrap
                            >
                                {currentFolder.name}
                    </Typography>
                    {pathList.map((pathItem) => {
                            return <PathItem key = {pathItem.fullPath} name = {pathItem.name} pathItem = {pathItem} pathTraverse = {pathTraverse}/>
                        })}
                </MenuList>
            </div>
       </Paper>
    )
}
export default Path;