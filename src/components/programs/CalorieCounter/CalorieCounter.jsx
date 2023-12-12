import React, {lazy, Suspense, useContext} from 'react'
import { windowWidthContext, programContext } from '../../Context';


import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TopBarButtons from '../../topBarComponents/TopBarButtons';

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

    const { file, id, name, handlePointerDown, doubleClickResize, handleExit } = programInfo;

    const preventPositioning = (e) =>{
        e.stopPropagation()
    }
    const handlePointerDownTopBar = (e) => {
        handlePointerDown(e)
        doubleClickResize()
    }
    return (
        <div className = "windowMidContainer" style = {{width : "100%"}}>
            <Paper position = "relative" sx = {{height : "40px", padding: "0 5px 0 5px", boxSizing : "border-box", borderRadius : "10px 10px 0 0" , display : "grid", gridTemplateColumns : "1fr 1fr", alignItems : "center"}} onPointerDown = {handlePointerDownTopBar}>
                {/*This has a specific style because it has no file options*/}
                <Typography noWrap sx = {{width : "100%", userSelect : "none", paddingLeft : "10px", justifySelf : "start"}}>{ name }</Typography>
                <TopBarButtons program = {0} handleExit = {handleExit} preventPositioning = {preventPositioning}/>
            </Paper>
            <Paper elevation = {0} style = {{height: "100%", overflow: 'auto', borderRadius : "0 0 10px 10px"}}>
                {/*whats going on with all these divs? this was because of the backdrops I think */}
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

/*
    This is a better backdrop functionality, but backdrops will go off the screen. Give backdrops a scroll bar and this could be okay

            <Paper elevation = {0} style = {{height: "100%", position : "relative", overflow: 'hidden', borderRadius : "0 0 10px 10px"}}>
                <div style = {{display: "flex", placeItems: "center", height : "100%", overflow: 'auto'}}>
                    <div style = {{ margin : "auto", textAlign : "center", userSelect: "none"}}>
                        <Suspense>
                            <App media700W = {media700W} media600W = {media600W} media500W = {media500W}/>
                        </Suspense>
                    </div>
                </div>
            </Paper>
*/