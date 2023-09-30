import React, { useState , useRef} from 'react'


//materialUI stuff
import { AppBar, Toolbar, IconButton} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';


import Window from './Window'



function Screen() {

    //console.log("screen render")

    /*========================================================

    MOUSE TRACKING AND WINDOW POSITIONING

    a priority is to reduce unecessary renders

    ========================================================*/
    const [mouseLeaveState, setMouseLeaveState] = useState(null)
    const [mouseMove, setMouseMove] = useState(null)
    //this function will track the mouse. It is inteded to be used with a window postitioning function. When the mouse moves on screen
    //it will call a windows positioning function and move that window. If the mouse is let go or the mouse leaves the screen, it will stop tracking
    const changeFunction = (newFunc) => {
        //console.log("changeFunction")

        //see explanation in removeFunction. It is necessary here aswell
        window.getSelection().empty()
        setMouseMove(() => newFunc);
        setMouseLeaveState(() => removeFunction)
    }
    //this function will stop tracking the mouse
    const removeFunction = () =>{
        //window.getSelection().empty() is necessary to prevent dragging issues when moving a window
        //if the user is dragging a window, and the mouse moves beyond the windowEdge, it will begin selecting text, or elements undeneath the mouse
        //this will happen when trying to drag a window beyond the screen boundries. The browser will think the user was selecting something.
        //if the user tries to move a window again, they will instead begin to drag the selection. This sets the selection to null, so no draggin operation will occur
        window.getSelection().empty()
        setMouseMove(null);
        setMouseLeaveState(null);
    }

    return (
    <div className = "outterScreen">
        <AppBar 
            sx={{height: "40px", position: 'relative', unselectable:"on" }}
            options={{
                draggable: false,
              }}
        >
        </AppBar>
        <div className = "innerWindow" onPointerMove = {mouseMove} onMouseLeave = {mouseLeaveState} onMouseUp = {mouseLeaveState}>

            <Window
                changeFunction = {changeFunction}
                removeFunction = {removeFunction}
            />
        </div>    
    </div>
    )
}

export default Screen