import React, { useContext } from 'react'
import { windowWidthContext, programContext } from '../../Context';


import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TopBarButtons from '../../topBarComponents/TopBarButtons';

//Honestly using an Iframe works the best. It's the easiest to update, and its the most lightweight probably
//At ssome point, if there is already one open, clicking on the shortcut will just bring that program into focus
//What should happen if they no longer have internet though? what happens then? can I check for that or something
//Need to add in that "iscurrently resizing" or whatever I used for the old pdf reader

//cookies are in issue in iframes.
//Are they though? I wrote this before, but I'm not sure its an issue anymore.
//I think it actually was a issue when it wasn't an Iframe. Now I think the cookies work better.

//Pretty sure I will never use this now. Get rid of it when I get rid of the other media query stuff
/*
function mediaQueryDecider(width, minWidth) {
    if (width > minWidth) {
        return true;
    }
    return false;
}
*/

//I originally thought it might be a good Idea to have only one instance of the Calorie Counting app running at once

const CalorieCounter = (props) => {


    //Do I use this media stuff anywhere else? Maybe just get rid of it
    /*
    const media700W = mediaQueryDecider(width, 700);
    const media600W = mediaQueryDecider(width, 600);
    const media500W = mediaQueryDecider(width, 500);
    */

    const programInfo = useContext(programContext);

    const { file, id, name, handlePointerDown, doubleClickResize, handleExit, inFocus } = programInfo;
    const { windowPositioningInUse }= useContext(windowWidthContext)

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
            <Paper elevation = {0} style = {{height: "100%", borderRadius : "0 0 10px 10px"}}>
                {/*It may be the a good idea to combine the two transparent divs into one */}
                {!inFocus && <div style = {{position: "absolute", backgroundColor: "transparent", height : "100%", width: "100%", boxSizing : "border-box"}}></div>}
                {windowPositioningInUse && <div style = {{position: "absolute", backgroundColor: "transparent", height : "100%", width: "100%", boxSizing : "border-box"}}></div>}
                <iframe src="https://kristianlewis.com/caloriecounter/" height = {"100%"} width = {"100%"} style = {{borderRadius : "0 0 10px 10px", border : "none"}}></iframe>
            </Paper>
        </div>
    )
}

export default CalorieCounter;