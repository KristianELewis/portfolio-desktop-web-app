import React, { useState, useEffect, lazy, Suspense, useContext, useRef } from 'react'

//Programs
import Calculator from './programs/Calculator';
import CalorieCounter from './programs/CalorieCounter/CalorieCounter';
import PdfReader from './programs/PdfReader';
import ImageViewer from './programs/ImageViewer';
import FileManager from './programs/FileManager/FileManager';
import PianoSynthJS from './programs/PianoSynthJS/PianoSynthJS';

const TextEditor = lazy(() => import('./programs/TextEditor'));

//materialUI
import { windowWidthContext, fileContext, programContext } from './Context';

const Window = (props) => {
    const {
        screenDimensions, 
        windowPositioningInUse, 
        setFile, 
        FileSystem, 
        fileSystemState, 
        setFileSystemState, 
        addProgram, 
        editProgram, 
        id,
        file,
        name,
        quickAccessList, 
        addToQuickAccessList, 
        removeFromQuickAccessList
    } = props;

    /*=======================================================

        SETTING DEFAULT VALUES 

        Should have a way to set separate default values for window width and height. It should probably be passed down through props

    =======================================================*/
    const [position, setPosition] = useState(() => {
        if(props.screenWidth >= 720 && props.screenHeight >= 500){
            const leftInit = (props.screenWidth / 2) - (720 / 2)
            const topInit =  (props.screenHeight / 2) - (500 / 2)
            return ({left: leftInit, top: topInit, width: 720, height: 500, prevX : null, prevY : null})
        }
        else if(props.screenWidth >= 720)
        {
            const leftInit = (props.screenWidth / 2) - (720 / 2)
            return ({left: leftInit, top: 0, width: 720, height: props.screenHeight, prevX : null, prevY : null})
        }
        else if(props.screenHeight >= 500)
        {
            const topInit =  (props.screenHeight / 2) - (500 / 2)
            return ({left: 0, top: topInit, width: props.screenWidth, height: 500, prevX : null, prevY : null})
        }
        else{
            return ({left: 0, top: 0, width: props.screenWidth, height: props.screenHeight, prevX : null, prevY : null})
        }
    })  
    //not sure about this, might be a better way to do this other than using a state
    const [program, setProgram] = useState(() => { 
        if (props.name === "Text Editor")
        {
            return (<Suspense><TextEditor></TextEditor></Suspense>)
        }
        else if (props.name === "Calculator")
        {
            return (<Calculator></Calculator>)
        }
        else if (props.name === "PDF Viewer")
        {
            return (<PdfReader></PdfReader>)
        }
        else if (props.name === "Image Viewer")
        {
            return (<ImageViewer></ImageViewer>)
        }
        else if (props.name === "File Manager")
        {
            return (<FileManager></FileManager>)
        }
        else if (props.name === "Calorie Counter")
        {
            return (<CalorieCounter></CalorieCounter>)
        }
        else if (props.name === "PianoSynthJS")
        {
            return (<PianoSynthJS></PianoSynthJS>)
        }
        return null
    })
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

    /*const displayInfo = () => {
        console.log("left: " + position.left)
        console.log("width: " + position.width)
        console.log("top: " + position.top)
        console.log("height: " + position.height)
    }*/

    /*========================================================

    MOUSE TRACKING AND WINDOW POSITIONING

    a priority is to reduce unecessary renders


    would html drag events be better here?
    drag might fix problems with mouse leaving the window edge
    drag doesnt seem to work for this actually

    ========================================================*/
    
    const updatePointerPosition = e => {
        e.preventDefault();//why did I have this here?
        setPosition((prevState) => {
            const movementX = e.clientX - prevState.prevX;
            const movementY = e.clientY - prevState.prevY;
            let newLeft = prevState.left + movementX
            if(newLeft < 0){
                newLeft = 0
            }//can probably be else if
            if(newLeft > (props.screenWidth - prevState.width)){
                
                newLeft = props.screenWidth-prevState.width
            }
            let newTop = prevState.top + movementY
            if(newTop < 0){
                newTop = 0
            }
            if(newTop > (props.screenHeight - prevState.height)){
                newTop = (props.screenHeight - prevState.height)
            }
            return {...prevState, left : newLeft, top : newTop, prevX : e.clientX, prevY : e.clientY}
        })
    };



    //not really necesasry and isn't used. This should be deleted probably
    const handlePointerup = (e) => {
        props.removeFunction()
    }

    //This is for moving the window
    //should be renamed to something like move
    const handlePointerDown = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction( updatePointerPosition )

    }
    
    //position : "relative" must be placed in here. It is beining overwritten
    //padding also gets overwritten...
    //^^^^ these are old comments. There out of context in here. Might not be relevant anymore
    const handleExit = () => {
        props.removeProgram(props.id)
    }

    //This needs a check for if the new resizes is beyond the screen
    const clickCounter = useRef(0)
    const doubleClickResize = () => {
        if (clickCounter.current === 0)
        {
            clickCounter.current = 1;
            setTimeout(() => {
                clickCounter.current = 0
            }, 500)
        }
        else{
            setPosition( (preValue) => {
                if(props.screenWidth >= 720 && props.screenHeight >= 500){
                    return ({...preValue, width: 720, height: 500})
                }
                else if(props.screenWidth >= 720)
                {
                    return ({...preValue, top: 10, width: 720, height: props.screenHeight -20})
                }
                else if(props.screenHeight >= 500)
                {
                    return ({...preValue, left: 10, width: props.screenWidth - 20, height: 500})
                }
                else{
                    return ({...preValue, left: 10, top: 10, width: props.screenWidth - 20, height: props.screenHeight - 20})
                }
            })
        }
    }
    //The double click to resize is getting annoying, it should probably only be used in the topbar
    const focusWindow = () => {
        props.focusWindow(props.id)
    }

    /*=================================================
        
        RESIZING
    
        These share a lot of functionality. Maybe The could be made more generic, But using previous state makes that hard.
        I could potentially move this into individual components, but that might add uncessary complexity, while mkaing it harder to follow.
        Although much of this is just the same kind of bounds checking. Maybe just put the bounds checking if statments into their own functions, and then use those in these functions
        
        This needs to be refactored

    =================================================*/

    const handleResizeRight = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) =>{
            e.preventDefault();
            setPosition((prevState) => {
                const movementX = e.clientX - prevState.prevX;
                let newWidth = prevState.width + movementX
                if(newWidth < 150)
                {
                    newWidth = 150
                }
                if (newWidth > props.screenWidth - prevState.left)
                {
                    newWidth = props.screenWidth - prevState.left
                }
                return {...prevState, width : newWidth, prevX : e.clientX}
        })})
    }
    const handleResizeBottom = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) => {
            e.preventDefault();
            setPosition((prevState) => {
                const movementY = e.clientY - prevState.prevY;
                let newHeight = prevState.height + movementY
                if(newHeight < 100)
                {
                    newHeight = 100
                }
                if (newHeight > props.screenHeight - prevState.top)
                {
                    newHeight = props.screenHeight - prevState.top
                }
                return {...prevState, height : newHeight, prevY : e.clientY}
        })})
    }
    const handleResizeTop = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) =>{ 
            e.preventDefault();
            setPosition((prevState) => {
                const movementY = e.clientY - prevState.prevY;
                let newTop = prevState.top + movementY;
                let newHeight = prevState.height + (movementY * -1);
                if (newTop <= 0)
                {
                    newTop = 0
                    newHeight = prevState.height + prevState.top
                }
                else if (newHeight <= 100)
                {
                    newTop = prevState.top + (prevState.height - 100)
                    newHeight = 100
                }
                else if (newHeight >= props.screenHeight)
                {
                    newTop = 0
                    newHeight = props.screenHeight
                }
                return {...prevState, top : newTop, height: newHeight, prevY : e.clientY}
            })
        })
    }

    const handleResizeleft = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) =>{ 
            e.preventDefault();
            setPosition((prevState) => {
                const movementX = e.clientX - prevState.prevX;
                let newLeft = prevState.left + movementX;
                let newWidth = prevState.width + (movementX * -1);
                if (newLeft <= 0)
                {
                    newLeft = 0
                    newWidth = prevState.width + prevState.left
                }
                else if (newWidth <= 150)
                {
                    newLeft = prevState.left + (prevState.width - 150)
                    newWidth = 150
                }
                else if (newWidth >= props.screenWidth)
                {
                    newLeft = 0
                    newWidth = props.screenWidth
                }
                return {...prevState, left : newLeft, width: newWidth, prevX : e.clientX}
            })
        })
    }
    const handleResizeBottomRight = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) => {
            e.preventDefault();
            setPosition((prevState) => {
                const movementX = e.clientX - prevState.prevX;
                const movementY = e.clientY - prevState.prevY;

                let newHeight = prevState.height + movementY
                if(newHeight < 100)
                {
                    newHeight = 100
                }
                if (newHeight > props.screenHeight - prevState.top)
                {
                    newHeight = props.screenHeight - prevState.top
                }
                let newWidth = prevState.width + movementX
                if(newWidth < 150)
                {
                    newWidth = 150
                }
                if (newWidth > props.screenWidth - prevState.left)
                {
                    newWidth = props.screenWidth - prevState.left
                }
                return {...prevState, height : newHeight, width : newWidth, prevX : e.clientX, prevY : e.clientY}
        })})
    }
    const handleResizeTopRight = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) => {
            e.preventDefault();
            setPosition((prevState) => {
                const movementX = e.clientX - prevState.prevX;
                const movementY = e.clientY - prevState.prevY;

                let newTop = prevState.top + movementY;
                let newHeight = prevState.height + (movementY * -1);
                if (newTop <= 0)
                {
                    newTop = 0
                    newHeight = prevState.height + prevState.top
                }
                else if (newHeight <= 100)
                {
                    newTop = prevState.top + (prevState.height - 100)
                    newHeight = 100
                }
                else if (newHeight >= props.screenHeight)
                {
                    newTop = 0
                    newHeight = props.screenHeight
                }
                let newWidth = prevState.width + movementX
                if(newWidth < 150)
                {
                    newWidth = 150
                }
                if (newWidth > props.screenWidth - prevState.left)
                {
                    newWidth = props.screenWidth - prevState.left
                }
                return {...prevState, top : newTop, height : newHeight, width : newWidth, prevX : e.clientX, prevY : e.clientY}
        })})
    }
    const handleResizeBottomLeft = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) => {
            e.preventDefault();
            setPosition((prevState) => {
                const movementX = e.clientX - prevState.prevX;
                const movementY = e.clientY - prevState.prevY;

                let newHeight = prevState.height + movementY
                if(newHeight < 100)
                {
                    newHeight = 100
                }
                if (newHeight > props.screenHeight - prevState.top)
                {
                    newHeight = props.screenHeight - prevState.top
                }
                let newLeft = prevState.left + movementX;
                let newWidth = prevState.width + (movementX * -1);
                if (newLeft <= 0)
                {
                    newLeft = 0
                    newWidth = prevState.width + prevState.left
                }
                else if (newWidth <= 150)
                {
                    newLeft = prevState.left + (prevState.width - 150)
                    newWidth = 150
                }
                else if (newWidth >= props.screenWidth)
                {
                    newLeft = 0
                    newWidth = props.screenWidth
                }
                return {...prevState, left : newLeft, height : newHeight, width : newWidth, prevX : e.clientX, prevY : e.clientY}
        })})
    }
    const handleResizeTopLeft = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) => {
            e.preventDefault();
            setPosition((prevState) => {
                const movementX = e.clientX - prevState.prevX;
                const movementY = e.clientY - prevState.prevY;

                let newTop = prevState.top + movementY;
                let newHeight = prevState.height + (movementY * -1);
                if (newTop <= 0)
                {
                    newTop = 0
                    newHeight = prevState.height + prevState.top
                }
                else if (newHeight <= 100)
                {
                    newTop = prevState.top + (prevState.height - 100)
                    newHeight = 100
                }
                else if (newHeight >= props.screenHeight)
                {
                    newTop = 0
                    newHeight = props.screenHeight
                }
                let newLeft = prevState.left + movementX;
                let newWidth = prevState.width + (movementX * -1);
                if (newLeft <= 0)
                {
                    newLeft = 0
                    newWidth = prevState.width + prevState.left
                }
                else if (newWidth <= 150)
                {
                    newLeft = prevState.left + (prevState.width - 150)
                    newWidth = 150
                }
                else if (newWidth >= props.screenWidth)
                {
                    newLeft = 0
                    newWidth = props.screenWidth
                }
                return {...prevState, top : newTop, left : newLeft, height : newHeight, width : newWidth, prevX : e.clientX, prevY : e.clientY}
        })})
    }

    return (
        <div className = "window"
            onPointerDown = {focusWindow}
            style = {{
                boxSizing : "border-box",
                position: "absolute",
                left : position.left + "px",
                top : position.top + "px",
                height: position.height + "px",
                width: position.width + "px",
                zIndex : props.zLevel,
                border : "solid #313131 1px",
                borderRadius : "10px"
        }}>
                {/* this context should be renamed*/}
                <windowWidthContext.Provider value = {{width : position.width, height : position.height, windowPositioningInUse : windowPositioningInUse}}>
                {/* 
                    Not sure about this fileSystem context. There was some heated debate I had with myself here about it.
                    Probably should be moved up to screen. Desktop also needs this context anyway
                */}
                <fileContext.Provider value = {{
                    FileSystem : FileSystem.current, 
                    fileSystemState : fileSystemState, 
                    setFileSystemState : setFileSystemState, 
                    quickAccessList : quickAccessList, 
                    addToQuickAccessList : addToQuickAccessList, 
                    removeFromQuickAccessList : removeFromQuickAccessList
                    }}>
                <programContext.Provider value = {{id: id, file : file, name : name, handlePointerDown : handlePointerDown, doubleClickResize : doubleClickResize, handleExit : handleExit}}>
                    {program}
                    {/*chooseProgram()*/}
                </programContext.Provider>
                </fileContext.Provider>
                </windowWidthContext.Provider>
                {/*---------------
                REGULAR RESIZERS
                +++++++++++++++++
                Left
                Right
                Top
                Bottom
                ---------------*/}
                <div className= "left-right-resizer" style = {{height : "100%", width : "15px", backgroundColor : "transparent", position : "absolute", left: "-10px"}} onPointerDown = {handleResizeleft}></div>
                <div className= "left-right-resizer" style = {{height : "100%", width : "15px", backgroundColor : "transparent", position : "absolute", left : (position.width - 5) + "px"}} onPointerDown = {handleResizeRight}></div>
                <div className = "top-bottom-resizer" style = {{height : "15px", width : "100%", backgroundColor : "transparent", position : "absolute", top : "-10px"}} onPointerDown = {handleResizeTop}/>
                <div className = "top-bottom-resizer" style = {{height : "15px", width : "100%", backgroundColor : "transparent", position : "absolute", top : (position.height - 5) + "px"}} onPointerDown = {handleResizeBottom}/>
                {/*---------------
                CORNER RESIZERS
                +++++++++++++++++
                Bottom Right
                Top Left
                Top Right
                Bottom Left
                ---------------*/}
                <div className = "nwse-resizer" style = {{height : "20px", width : "20px", backgroundColor : "transparent", position : "absolute", left : (position.width -10) + "px", top : (position.height -10 ) + "px"}} onPointerDown = {handleResizeBottomRight}/>
                <div className = "nwse-resizer" style = {{height : "20px", width : "20px", backgroundColor : "transparent", position : "absolute", left : "-10px", top : "-10px"}} onPointerDown = {handleResizeTopLeft}/>
                <div className = "nesw-resizer" style = {{height : "20px", width : "20px", backgroundColor : "transparent", position : "absolute", left : (position.width -10) + "px", top : "-10px"}} onPointerDown = {handleResizeTopRight}/>
                <div className = "nesw-resizer" style = {{height : "20px", width : "20px", backgroundColor : "transparent", position : "absolute", left : "-10px", top : (position.height -10) + "px"}} onPointerDown = {handleResizeBottomLeft}/>
        </div>
    )
}
export default Window;
/*


There is no outer screen border anymore
probably just delete this, I wont be using this

This was an idea for having the resizers not bound to the overflow hidden of the outter screen.
It might instead be better to just double tap and resize the window to something smaller than the current screen

<div className= "left-right-resizer" style = {{height : position.height + "px", width : "15px", backgroundColor : "green", position : "fixed", left: (position.left + "px"), top : (position.top + 5 + "px")}} onPointerDown = {handleResizeleft}></div>
<div className= "left-right-resizer" style = {{height : position.height + "px", width : "15px", backgroundColor : "green", position : "fixed", left : (position.left + position.width ) + "px", top : position.top + 5 + "px"}} onPointerDown = {handleResizeRight}></div>
<div className = "top-bottom-resizer" style = {{height : "15px", width : position.width + "px", backgroundColor : "green", position : "fixed", top : position.top - 5 + "px"}} onPointerDown = {handleResizeTop}/>
<div className = "top-bottom-resizer" style = {{height : "15px", width : position.width + "px", backgroundColor : "green", position : "fixed", top : (position.top + position.height ) + "px"}} onPointerDown = {handleResizeBottom}/>

<div className = "nwse-resizer" style = {{height : "20px", width : "20px", backgroundColor : "green", position : "fixed", left : (position.width -5) + "px", top : (position.height -5 ) + "px"}} onPointerDown = {handleResizeBottomRight}/>
<div className = "nwse-resizer" style = {{height : "20px", width : "20px", backgroundColor : "green", position : "fixed", left : "-10px", top : "-10px"}} onPointerDown = {handleResizeTopLeft}/>
<div className = "nesw-resizer" style = {{height : "20px", width : "20px", backgroundColor : "green", position : "fixed", left : (position.width -5) + "px", top : "-10px"}} onPointerDown = {handleResizeTopRight}/>
<div className = "nesw-resizer" style = {{height : "20px", width : "20px", backgroundColor : "green", position : "fixed", left : "-10px", top : (position.height -5) + "px"}} onPointerDown = {handleResizeBottomLeft}/>
*/