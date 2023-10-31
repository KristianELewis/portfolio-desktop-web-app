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

    -The timer prevents jump behavoir from multiple calls while a scroll is in progress
        -This is a sort of debounce
    -everytime the user scrolls, the amount scrolled increase
    -If the timer is not set yet, a short timer will be set
        -at the end of the timer the path will be scrolled in the x direction bu the accumulated scroll amount

    -this could be adjusted to wait for the end of user input instead
        -its still a little jumpy on longer scrolls.
        -In normal use waiting for the user to finish scrolling should cause any problems
            -The user would purposefully need to continuesly scroll to even notice
        -not sure if an adjustment is necessary, this works fine
    -------------------------------------*/

    let scrollTimer;
    const scrollAmount = useRef(0)
    const scrollRef = useRef(null)
    const scrollTimerAction = () => {
        scrollRef.current.scrollBy(scrollAmount.current, 0)
        scrollAmount.current = 0;
        scrollTimer = null
    }
    const handleScrolling = (e) => {
        const scrollIncrement = e.deltaY;
        scrollAmount.current += scrollIncrement
        if(!scrollTimer){
            scrollTimer = setTimeout(() => {
                scrollTimerAction()
            }, 100)
        }   
    }
    
    /*For scrolling functionality, but without the scrollwheel, I needed to use a css class*/
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