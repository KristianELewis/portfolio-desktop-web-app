import React, { useState } from 'react'


const Window = (props) => {

    //console.log("rendering Window")
    const [left, setLeft] = useState(50)
    const [top, setTop] = useState(50)
    //these should be a state
    let width = 100;
    let height = 100;
 
    /*========================================================

    MOUSE TRACKING AND WINDOW POSITIONING

    a priority is to reduce unecessary renders

    ========================================================*/
    
    const updateMousePosition = e => {
        setLeft((prevState) => {
            const newState = prevState + e.movementX;
            if(newState < 0){
                return 0
            }
            if(newState > (1280 - width)){
                return (1280-width)
            }
            return newState
        })
        setTop((prevState) => {
            const newState = prevState + e.movementY
            if(newState < 0){
                return 0
            }
            if(newState > (720- height)){
                return (720-height)
            }
            return newState
        })
    };
    const handleMouseup = (e) => {
        props.removeFunction()

    }
    const handleMouseDown = (e) => {
        props.changeFunction( updateMousePosition )

    }


    return (
        <div className = "testWindow" 
            onMouseDown = {handleMouseDown} 
            onMouseUp = {handleMouseup} 
            style = {{
                position: "relative",
                left : left + "px",
                top : top + "px"
            }}
            >
        </div>
    )
}



export default Window;