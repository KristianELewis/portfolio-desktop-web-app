import React, { useState, useEffect, lazy, Suspense, useContext, useRef } from 'react'

//Programs
import Calculator from './programs/Calculator';
import CalorieCounter from './programs/CalorieCounter/CalorieCounter';
import PdfReader from './programs/PdfReader';
import ImageViewer from './programs/ImageViewer';
import FileManager from './programs/FileManager/FileManager';
import PianoSynthJS from './programs/PianoSynthJS/PianoSynthJS';

const TextEditor = lazy(() => import('./programs/TextEditor'));

import { windowWidthContext, fileContext, programContext } from './Context';
import { resizeBottom,resizeLeft, resizeRight, resizeTop, defaultDimensions } from './windowSizeFunctions';

const Window = (props) => {
    const {
        FileSystem, 
        fileSystemState, 
        setFileSystemState, 
        id,
        file,
        name,
        screenWidth,
        screenHeight,
        defaultWidth,
        defaultHeight,
        windowPositioningInUse, 
        quickAccessList, 
        addToQuickAccessList, 
        removeFromQuickAccessList,
        currentZLevel,
        zLevel

    } = props;

    /*=======================================================

        SETTING DEFAULT VALUES 

        Should have a way to set separate default values for window width and height. It should probably be passed down through props

    =======================================================*/
    const [position, setPosition] = useState(defaultDimensions(defaultWidth, defaultHeight, screenWidth, screenHeight))  
    //not sure about this, might be a better way to do this other than using a state
    //I dont like how this is done.
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
        Mostly of it's in windowSizeFunctions
        Cleaner, maybe could be refactored some more. Not sure about the e.preventDefault. I have to test if thats need.
    =================================================*/

    const handleResizeRight = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) =>{
            e.preventDefault();
            setPosition((prevState) => {
                return resizeRight(e, prevState, props.screenWidth);
        })})
    }
    const handleResizeBottom = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) => {
            e.preventDefault();
            setPosition((prevState) => {
                return resizeBottom(e, prevState, props.screenHeight);
        })})
    }
    const handleResizeTop = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) =>{ 
            e.preventDefault();
            setPosition((prevState) => {
                return resizeTop(e, prevState, props.screenHeight);
            })
        })
    }

    const handleResizeleft = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) =>{ 
            e.preventDefault();
            setPosition((prevState) => {
                return resizeLeft(e, prevState, screenWidth);
            })
        })
    }
    const handleResizeBottomRight = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) => {
            e.preventDefault();
            setPosition((prevState) => {
                const rightInfo = resizeRight(e, prevState, props.screenWidth);
                const bottomInfo = resizeBottom(e, prevState, props.screenHeight);
                return {...prevState, height : bottomInfo.height, width : rightInfo.width, prevX : rightInfo.prevX, prevY : bottomInfo.prevY}
        })})
    }
    const handleResizeTopRight = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) => {
            e.preventDefault();
            setPosition((prevState) => {
                const rightInfo = resizeRight(e, prevState, props.screenWidth);
                const topInfo = resizeTop(e, prevState, props.screenHeight);
                return {...prevState, top : topInfo.top, height : topInfo.height, width : rightInfo.width, prevX : rightInfo.prevX, prevY : topInfo.prevY}
        })})
    }
    const handleResizeBottomLeft = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) => {
            e.preventDefault();
            setPosition((prevState) => {
                const leftInfo = resizeLeft(e, prevState, props.screenWidth);
                const bottomInfo = resizeBottom(e, prevState, props.screenHeight);
                return {...prevState, height : bottomInfo.height, left : leftInfo.left, width : leftInfo.width, prevX : leftInfo.prevX, prevY : bottomInfo.prevY}
        })})
    }
    const handleResizeTopLeft = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction((e) => {
            e.preventDefault();
            setPosition((prevState) => {
                const leftInfo = resizeLeft(e, prevState, props.screenWidth);
                const topInfo = resizeTop(e, prevState, props.screenHeight);
                return {...prevState, top : topInfo.top, height : topInfo.height, left : leftInfo.left, width : leftInfo.width, prevX : leftInfo.prevX, prevY : topInfo.prevY}
        })})
    }

    let inFocus = false;

    if(currentZLevel === zLevel){
        inFocus = true;
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
                zIndex : zLevel,
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
                <programContext.Provider value = {{id: id, file : file, name : name, handlePointerDown : handlePointerDown, doubleClickResize : doubleClickResize, handleExit : handleExit, inFocus : inFocus}}>
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