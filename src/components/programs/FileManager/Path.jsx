import React, {useRef} from 'react';

import MenuList from "@mui/material/MenuList";
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const PathItem = (props) => {
    const {name, pathItem, pathTraverse, preventPositioning} = props;

    const handleClick = () => {
        pathTraverse(pathItem)
    }

    return(
        <>
            {/*This is breaking when I change it from a span to anything else. I'm not sure why */}
            <Typography sx = {{
                display: "inline-block", 
                boxSizing: "border-box", 
                paddingLeft: "7px", 
                paddingRight: "7px",
                fontSize : "18px", 
                verticalAlign: "middle",
                userSelect : "none",
                }}>
                    /
            </Typography>
            <MenuItem 
                onClick = {handleClick} 
                onPointerDown = {preventPositioning}
                sx = {{
                    display: "inline-block", 
                    borderRadius : "5px", 
                    boxSizing: "border-box",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                    marginLeft : "2px",
                    marginRight : "2px", 
                    direction : "ltr",
                    maxHeight : "32px",//without these It gets set to min Height 42 or something at less than 600 width, messing everything up
                    minHeight : "32px"
                }}>
                    <Typography sx = {{boxSizing: "border-box", maxWidth : "100px"}} noWrap>{name}</Typography>
            </MenuItem>
        </>
    )
}

const Path = (props) => {
    const { path, id, currentFolder, pathTraverse, preventPositioning } = props;

    let tempFolder = currentFolder.parent;
    let pathList = [];
    while(tempFolder != null){
        pathList.push(tempFolder);
        tempFolder = tempFolder.parent;
    }

    /*-------------------------------------

    This allows for horizontal scrolling of the path when it is overflowing

    -Its a little jumpy right now
        -To fix this I need to learn about debouncing and useDefferedValue.
        -I have to figure out which way will work best for this
        
    -There some issue with menu items getting larger automatically for some responsive design. I need to fix this


    -From what I understand after a very brief search
        -I add up the values of the amount scrolled.
        -I can then do one of two things
            -I can wait till user input ends and then scroll by the accumulated amount
            -I can wait for a period of time and then scroll by the amount accumulated in that time
        
    -I think the second option is what I want
    -------------------------------------*/
    const scrollRef = useRef(null)
    const handleScrolling = (e) => {
        scrollRef.current.scrollBy(e.deltaY, 0)
    }
    
    /*For scrolling functionality, but without the scrollwheel, I needed to use a class*/
    return (
        <Paper 
            onTouchMove = {(e)=> {e.stopPropagation()}}
            onWheel={handleScrolling} 
            className = "Path" 
            ref = {scrollRef} 
            variant = "outlined" 
            sx = {{
                flexGrow : 1, 
                direction: "rtl", 
                overflowX : "auto", 
                maxHeight : "38px", 
                textAlign : "left", 
                whiteSpace : "nowrap"
                }}>

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
                            paddingBottom: "6px", 
                            direction : "ltr"
                            }} 
                            noWrap
                            >
                                {currentFolder.name}
                    </Typography>
                    {pathList.map((pathItem) => {
                            return <PathItem key = {pathItem.fullPath} name = {pathItem.name} pathItem = {pathItem} pathTraverse = {pathTraverse} preventPositioning = {preventPositioning}/>
                        })}
                </MenuList>
       </Paper>
    )
}
export default Path;