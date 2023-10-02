import React, { useState, useEffect } from 'react'
import TextEditor from './programs/TextEditor'
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography'

const Window = (props) => {

    //console.log("rendering Window")

    const [position, setPosition] = useState({left: 50, top: 50, width: 300, height: 300})

    //maybe move if statements inside set position?
    /*=======================================================

        SCREEN DIMENSION CHANGE 
        if the dimensions of the screen change, these two useEffects will make sure the window is still contained within the screens boundries

    =======================================================*/
    useEffect(() => {
        if(position.width > props.screenWidth){
            setPosition((oldState) => {
                return {...oldState, left: 0, width: props.screenWidth}
            })
        }
        else if(position.width + position.left > props.screenWidth){
            setPosition((oldState) => {
                return {...oldState, left: props.screenWidth - position.width}
            })
        }
    }, [props.screenWidth])

    useEffect(() => {
        if(position.height > props.screenHeight){
            setPosition((oldState) => {
                return {...oldState, top: 0, height: props.screenHeight}
            })
        }
        else if(position.height + position.top > props.screenHeight){
            setPosition((oldState) => {
                return {...oldState, top: props.screenHeight - position.height}
            })
        }
    }, [props.screenHeight])
    /*========================================================

    MOUSE TRACKING AND WINDOW POSITIONING

    a priority is to reduce unecessary renders


    would html drag events be better here?
    drag might fix problems with mouse leaving the window edge
    drag doesnt seem to work for this actually

    ========================================================*/
    
    const updateMousePosition = e => {
        setPosition((prevState) => {
            let newLeft = prevState.left + e.movementX
            if(newLeft < 0){
                newLeft = 0
            }//can probably be else if
            if(newLeft > (props.screenWidth - prevState.width)){
                
                newLeft = props.screenWidth-prevState.width
            }
            let newTop = prevState.top + e.movementY
            if(newTop < 0){
                newTop = 0
            }
            if(newTop > (props.screenHeight - prevState.height)){
                newTop = (props.screenHeight - prevState.height)
            }
            return {...prevState, left : newLeft, top : newTop}
        })
    };
    //not really necesasry
    const handleMouseup = (e) => {
        props.removeFunction()
    }
    const handleMouseDown = (e) => {
        props.changeFunction( updateMousePosition )

    }
    
    //mouse up may be redundant

    //position : "relative" must be placed in here. It is beinin overwritten
    //padding also gets overwritten...


    const handleExit = () => {
        props.removeProgram(props.id)
    }
    const focusWindow = () => {
        props.focusWindow(props.id)
    }

    /*-------------------------------------------------
        
        RESIZING
    
        does not include ne nw se sw resizers
        style could use some work
    
        should find a good way to calculate minimum width, or maybe just get rid of tome top bar things if the width gets too small

        resizing top and left is still wonky
        currently will continue to shrink if mouse is not over edge and left or top is 0
        will also shink by another 1 - 2 pixels when width or height is at the minimum


        its relying on leaving the inner screen to control expanding beyond the borders
    -------------------------------------------------*/

    const handleResizeRight = () => {
        props.changeFunction((e) => 
            setPosition((prevState) => {
                let newWidth = prevState.width + e.movementX
                if(newWidth < 150)
                {
                    newWidth = 150
                }
                if (newWidth > props.screenWidth - prevState.left)
                {
                    newWidth = props.screenWidth - prevState.left
                }
                return {...prevState, width : newWidth}
        }))
    }
    const handleResizeBottom = () => {
        props.changeFunction((e) => 
            setPosition((prevState) => {
                let newHeight = prevState.height + e.movementY
                if(newHeight < 100)
                {
                    newHeight = 100
                }
                if (newHeight > props.screenHeight - prevState.top)
                {
                    newHeight = props.screenHeight - prevState.top
                }
                return {...prevState, height : newHeight}
        }))
    }

    const handleResizeTop = () => {
        props.changeFunction((e) =>{ 
            setPosition((oldState) => {
                let newTop = oldState.top + e.movementY;
                let newHeight = oldState.height + (e.movementY * -1);
                if (newTop <= 0)
                {
                    newTop = 0
                    newHeight = oldState.height + oldState.top
                }
                else if (newHeight <= 100)
                {
                    newTop = oldState.top + (oldState.height - 100)
                    newHeight = 100
                }
                else if (newHeight >= props.screenHeight)
                {
                    newTop = 0
                    newHeight = props.screenHeight
                }
                return {...oldState, top : newTop, height: newHeight}
            })
        })
    }

    const handleResizeleft = () => {
        props.changeFunction((e) =>{ 
            setPosition((oldState) => {
                let newLeft = oldState.left + e.movementX;
                let newWidth = oldState.width + (e.movementX * -1);
                if (newLeft <= 0)
                {
                    newLeft = 0
                    newWidth = oldState.width + oldState.left
                }
                else if (newWidth <= 150)
                {
                    newLeft = oldState.left + (oldState.width - 150)
                    newWidth = 150
                }
                else if (newWidth >= props.screenWidth)
                {
                    newLeft = 0
                    newWidth = props.screenWidth
                }
                return {...oldState, left : newLeft, width: newWidth}
            })
        })
    }

    /*const displayInfo = () => {
        console.log("left: " + position.left)
        console.log("width: " + position.width)
        console.log("top: " + position.top)
        console.log("height: " + position.height)
    }*/
    const chooseProgram = () => {
        if (props.name === "Text Editor")
        {
            return <TextEditor></TextEditor>
        }
    }
    return (
        <div className = "window"
            onMouseDown = {focusWindow}
            style = {{
                position: "absolute",
                left : position.left + "px",
                top : position.top + "px",
                height: position.height + "px",
                width: position.width + "px",
                zIndex : props.zLevel
        }}>

            {/*can't tell if preformance got significantly worse after adding resizer or not. Before adding the code */}
            <div className = "left-right-resizer" onMouseDown = {handleResizeleft}/>
            <div className = "windowMidContainer"
                style = {{
                    /*I spent an annoying amount of time messing around with this and just gave up and did this 
                    width is having trouble being calculated correctly due to the 5px things on the left and right and 
                    i cant get flex box to cooperate. Will probably change this in the future
                    
                    */
                    width: (position.width - 10) + "px"
                }}
            >
                <div className = "top-bottom-resizer" onMouseDown = {handleResizeTop}/>
                <div className = "windowTopBar" 
                    onMouseDown = {handleMouseDown} 
                >
                    <Typography sx = {{userSelect: "none"}}>{props.name}</Typography>
                    <CloseIcon 
                        sx = {{
                            color : "white",
                            "&:hover": { backgroundColor: "black" }
                        }}
                        onClick = {handleExit}
                    />

                </div>
                {chooseProgram()}
                <div className = "top-bottom-resizer" onMouseDown = {handleResizeBottom}/>
            </div>
            <div className= "left-right-resizer" onMouseDown={handleResizeRight}/>

        </div>
    )
}



export default Window;