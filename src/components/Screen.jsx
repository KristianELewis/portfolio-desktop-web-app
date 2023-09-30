import React, { useState , useRef} from 'react'

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
        setMouseMove(() => newFunc);
        setMouseLeaveState(() => removeFunction)
    }
    //this function will stop tracking the mouse
    const removeFunction = () =>{
        setMouseMove(null);
        setMouseLeaveState(null);
    }

    return (
    <div className = "innerWindow" onPointerMove = {mouseMove} onMouseLeave = {mouseLeaveState}>
        <Window
            changeFunction = {changeFunction}
            removeFunction = {removeFunction}
        />
    </div>    
    )
}

export default Screen