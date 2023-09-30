import React, { useState , useRef} from 'react'
import './App.css'



function App() {
    //console.log("rendering")
    //maybe use a useRef here
    const [isMouseDown, setIsMouseDown] = useState(false);
    //const [mousePos, setMousePos] = useState({x: null, y : null})
    const [left, setLeft] = useState(50)
    const [top, setTop] = useState(50)
     
    let width = 100;
    let height = 100;


    //right clicking and then coming back in will still give issues
    //mouse up adjustments should be taken by the screen, and not the objects
    const updateMousePosition = e => {
        if(isMouseDown){
            setLeft((prevState) => {
                const newState = prevState + e.movementX;
                if(newState < 0){
                    setIsMouseDown(false)
                    return 0
                }
                if(newState > (1280 - width)){
                    setIsMouseDown(false)
                    return (1280-width)
                }
                return newState
            })
            setTop((prevState) => {
                const newState = prevState + e.movementY
                if(newState < 0){
                    setIsMouseDown(false)
                    return 0
                }
                if(newState > (720- height)){
                    setIsMouseDown(false)
                    return (720-height)
                }
                return newState
            })
        }
    };

    //there may be a better way to do this, without the if statement
    //maybe instead of an if statement, if when a mouse down action is takern, it should also set the handlePointerMove function to updatemouse position
    //when a mouse up event happens it sets it to null or nothing
    const handlePointerMove = (e) => {
        updateMousePosition(e);
    }

    const handleMouseup = (e) => {
        //console.log("Mouse Up")
        setIsMouseDown(false);
    }

    const handleMouseDown = (e) => {
        //console.log("Mouse Down")
        setIsMouseDown(true);
    }


    return (
    <div className = "mainContainer" >
        <div className = "innerWindow" >
            <div className = "testWindow" 
                onMouseDown = {handleMouseDown} 
                onMouseUp = {handleMouseup} 
                onPointerMove = {handlePointerMove}
                style = {{
                    position: "relative",
                    left : left + "px",
                    top : top + "px"
                }}
                >
            </div>
        </div>
        
    </div>
    
    )
}

export default App