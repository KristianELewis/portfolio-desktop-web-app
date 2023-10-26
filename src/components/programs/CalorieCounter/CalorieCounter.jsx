import React, {lazy, Suspense, useContext} from 'react'
import { windowWidthContext, programContext } from '../../Context';


import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close';

const App = lazy(() => import('./src/App'))

//At the moment, I am just copying and pasting the source folder into this project.
//There are probably other ways to do it, something about packing and using npm, but I don't really want to worry about managing 
//dependencie versions between the two projects like that right now. Just need to make it work after pasting it in and make a few minor adjustments

const mediaQueryDecider = (width, minWidth) => {
    if(width > minWidth)
    {
        return true;
    }
    return false;
}

//need to make it so there is only one instance of the calorie counter running at the same time
//Actually not sure about this anymore

const CalorieCounter = (props) => {

    const {width} = useContext(windowWidthContext);
    const media700W = mediaQueryDecider(width, 700);
    const media600W = mediaQueryDecider(width, 600);
    const media500W = mediaQueryDecider(width, 500);

    //this can probably be re arranged differently, but for now this works
    
    //info button should allow the user to navigate to the standalone version
    //need minimum height and widths


    const programInfo = useContext(programContext);

    const { file, id, name, handleMouseDown, handleExit } = programInfo;

    const preventPositioning = (e) =>{
        e.stopPropagation()
    }

    return (
        <div className = "windowMidContainer" style = {{width : "100%"}}>
            <Paper position = "relative" sx = {{height : "40px", display : "flex", justifyContent : "space-between", alignItems : "center"}} onMouseDown = {handleMouseDown}>
                {/* <Button color = 'inherit' onClick = {handleFilesClick} onMouseDown = {preventPositioning}>Files</Button>
                <Menu
                    anchorEl={filesAnchor}
                    open = {fileOpen}
                    onClose ={handleCloseFiles}
                    onMouseDown = {preventPositioning}
                >
                    <MenuItem onClick={newFile}>New File</MenuItem>
                    <MenuItem onClick={saveData}>Save File</MenuItem>
                    <MenuItem onClick={loadFile}>Load File</MenuItem>
                </Menu> */}

                <Typography sx = {{userSelect : "none", paddingLeft : "10px"}}>{ name }</Typography>
                <CloseIcon 
                    sx = {{
                        color : "white",
                        "&:hover": { backgroundColor: "black" }
                    }}
                    onClick = {handleExit}
                    onMouseDown = {preventPositioning}
                />
            </Paper>
            <Paper elevation = {0} style = {{height: "100%", overflow: 'auto'}}>
                <div style = {{display: "flex", placeItems: "center",  minHeight: "100%", position : "relative"}}>
                    <div style = {{ margin : "auto", textAlign : "center", userSelect: "none"}}>
                        <Suspense>
                            <App media700W = {media700W} media600W = {media600W} media500W = {media500W}/>
                        </Suspense>
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default CalorieCounter;