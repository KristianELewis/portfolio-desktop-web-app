import React, { useState } from 'react'
import TextEditor from './programs/TextEditor'
import CloseIcon from '@mui/icons-material/Close';


const Window = (props) => {

    //console.log("rendering Window")
    const [left, setLeft] = useState(50)
    const [top, setTop] = useState(50)
    //these should be a state
    const [width, setWidth] = useState(300)
    const [height, setHeight] = useState(300)

 
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
    -------------------------------------------------*/

    const handleResizeRight = () => {
        props.changeFunction((e) => setWidth((prevState) => {
            const newState = prevState + e.movementX
            if(newState < 50)
            {
                return 50
            }
            if (newState > 1280)
            {
                return 1280
            }
            return newState
        }))
    }
    const handleResizeBottom = () => {
        props.changeFunction((e) => setHeight((prevState) => {
            const newState = prevState + e.movementY
            if(newState < 50)
            {
                return 50
            }
            if (newState > 720)
            {
                return 720
            }
            return newState
        }))
    }

    const handleResizeTop = () => {
        props.changeFunction((e) =>{ 
        
            setHeight((prevState) => {
                const newState = prevState + (e.movementY*-1)
                if(newState <= 50)
                {
                    return 50
                }
                if(newState >= 720)
                {
                    return 720
                }
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
                return newState
            })
        })
    }

    const handleResizeleft = () => {
        props.changeFunction((e) =>{ 
            setWidth((prevState) => {
                const newState = prevState + (e.movementX*-1)
                if(newState <= 50)
                {
                    return 50
                }
                if(newState >= 1280)
                {
                    return 1280
                }
                setLeft((prevState) => {
                    const newState = prevState + e.movementX
                    if(newState < 0){
                        return 0
                    }
                    if(newState > (1280 - width)){
                        return (1280 - width)
                    }
                    return newState
                })
                return newState
            })
        })
    }


    return (
        <div className = "window"
            onMouseDown = {focusWindow}
            style = {{
                position: "absolute",
                left : left + "px",
                top : top + "px",
                height: height + "px",
                width: width + "px",
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
                    width: (width - 10) + "px"
                }}
            >
                <div className = "top-bottom-resizer" onMouseDown = {handleResizeTop}/>
                <div className = "windowTopBar" 
                    onMouseDown = {handleMouseDown} 
                >
                    <CloseIcon 
                        sx = {{
                            color : "white",
                            "&:hover": { backgroundColor: "black" }
                        }}
                        onClick = {handleExit}
                    />

                </div>
                <TextEditor></TextEditor>
                <div className = "top-bottom-resizer" onMouseDown = {handleResizeBottom}/>
            </div>
            <div className= "left-right-resizer" onMouseDown={handleResizeRight}/>

        </div>
    )
}



export default Window;