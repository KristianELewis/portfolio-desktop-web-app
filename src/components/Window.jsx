import React, { useState } from 'react'
//import TextEditor from './programs/TextEditor'

const Window = (props) => {

    //console.log("rendering Window")
    const [left, setLeft] = useState(50)
    const [top, setTop] = useState(50)
    //these should be a state
    let width = 200;
    let height = 200;
 
    /*========================================================

    MOUSE TRACKING AND WINDOW POSITIONING

    a priority is to reduce unecessary renders


    would html drag events be better here?
    drag might fix problems with mouse leaving the window edge
    drag doesnt seem to work for this actually

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
    
    //mouse up my be redundant
    return (
        <div className = "window"
        style = {{
            position: "relative",
            left : left + "px",
            top : top + "px"
        }}>

            <div className = "windowEdge" 
                onMouseDown = {handleMouseDown} 
                onMouseUp = {handleMouseup} 
            />

        </div>
    )
}



export default Window;