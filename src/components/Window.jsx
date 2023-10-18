import React, { useState, useEffect, useContext, useRef } from 'react'

//Programs
import TextEditor from './programs/TextEditor';
import Calculator from './programs/Calculator';
import CalorieCounter from './programs/CalorieCounter/CalorieCounter';
import PdfReader from './programs/PdfReader';
import ImageViewer from './programs/ImageViewer';

import FileManager from './programs/FileManager/FileManager';


//materialUI
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

import { windowWidthContext, fileContext, programContext } from './Context';

import { Folder, File } from './programs/FileManager/fileSystem';

const Window = (props) => {
    //const [file, setFile] = useState(null)

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
    //console.log("Window Render: " + file)

    //console.log("rendering Window")
    const [position, setPosition] = useState({left: 50, top: 50, width: 300, height: 300})
    //not sure about this, might be a better way to do this other than using a state
    const [program, setProgram] = useState(null)
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

    /*=======================================================

        SETTING DEFAULT VALUES 
        if the dimensions of the screen change, these two useEffects will make sure the window is still contained within the screens boundries

    =======================================================*/

    /*const displayInfo = () => {
        console.log("left: " + position.left)
        console.log("width: " + position.width)
        console.log("top: " + position.top)
        console.log("height: " + position.height)
    }*/

    //this should be an effect
    useEffect(() => {
        if (props.name === "Text Editor")
        {
            setProgram(<TextEditor editProgram = {editProgram}></TextEditor>)
        }
        else if (props.name === "Calculator")
        {
            setProgram(<Calculator></Calculator>)
        }
        else if (props.name === "PDF Viewer")
        {
            //this is coppied from below. I should find a width and height that works better than this
            setPosition({left: 50, top: 50, width: 720, height: 500})
            setProgram(<PdfReader></PdfReader>)
        }
        else if (props.name === "Image Viewer")
        {
            //this is coppied from below. I should find a width and height that works better than this
            setPosition({left: 50, top: 50, width: 720, height: 500})
            setProgram(<ImageViewer></ImageViewer>)
        }
        else if (props.name === "File Manager")
        {
            //this is coppied from below. I should find a width and height that works better than this
            setPosition({left: 50, top: 50, width: 720, height: 500})
            //not using file and setfile at the moment or maybe at all. Remove from program?
            //Pretty sure I can use context to pass setters and getters. I should probably do that isntead of using props
            setProgram(<FileManager addProgram = {addProgram} version = "Standalone"></FileManager>)
        }
        else if (props.name === "Calorie Counter")
        {
            //When saving the file, this will reset position, not sure if it has a similar effect in normal use in anyway.
            //If it becomes an issue I can set this to use a previous state
            setPosition({left: 50, top: 50, width: 720, height: 500})
            setProgram(<CalorieCounter></CalorieCounter>)
        }
        else{

        }
    }, [])
    /*========================================================

    MOUSE TRACKING AND WINDOW POSITIONING

    a priority is to reduce unecessary renders


    would html drag events be better here?
    drag might fix problems with mouse leaving the window edge
    drag doesnt seem to work for this actually

    ========================================================*/
    
    const updateMousePosition = e => {
        e.preventDefault();
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

    //position : "relative" must be placed in here. It is beining overwritten
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
        props.changeFunction((e) =>{
            e.preventDefault();
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
        })})
    }
    const handleResizeBottom = () => {
        props.changeFunction((e) => {
            e.preventDefault();
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
        })})
    }

    const handleResizeTop = () => {
        props.changeFunction((e) =>{ 
            e.preventDefault();
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
            e.preventDefault();
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
            {/* <div className = "left-right-resizer" onMouseDown = {handleResizeleft}/> */}
            <div className = "windowMidContainer" style ={{width: position.width + "px"}}>
            {/* style = {{
                    /*I spent an annoying amount of time messing around with this and just gave up and did this 
                    width is having trouble being calculated correctly due to the 5px things on the left and right and 
                    i cant get flex box to cooperate. Will probably change this in the future
                    
                    
                    width: (position.width - 10) + "px"
                }} */}
                {/* <div className = "windowTopBar" 
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

                </div> */}
                {/* this context should be renamed, and it can have a broader use */}
                <windowWidthContext.Provider value = {{width : position.width, windowPositioningInUse : windowPositioningInUse}}>
                {/* I think file system context can be brought up a level. 
                
                    You think? why the hell is this even in here. I need to bring this up a level. Desktop Icons aren't using this, I guess they're passed the values?
                    I guess I see why I just passed it down, but this seems weird and unecessary.
                    The use of context in this app is messy, I will need to deal with this

                    I will refactor this when I make a desktop component, for now it will stay
                
                */}
                <fileContext.Provider value = {{
                    FileSystem : FileSystem.current, 
                    fileSystemState : fileSystemState, 
                    setFileSystemState : setFileSystemState, 
                    quickAccessList : quickAccessList, 
                    addToQuickAccessList : addToQuickAccessList, 
                    removeFromQuickAccessList : removeFromQuickAccessList
                    }}>
                <programContext.Provider value = {{id: id, file : file, name : name, handleMouseDown : handleMouseDown, handleExit : handleExit}}>
                    {program}
                    {/*chooseProgram()*/}
                </programContext.Provider>
                </fileContext.Provider>
                </windowWidthContext.Provider>
                <div className= "left-right-resizer" style = {{height : "100%", width : "5px", backgroundColor : "transparent", position : "absolute"}} onMouseDown = {handleResizeleft}></div>
                <div className= "left-right-resizer" style = {{height : "100%", width : "5px", backgroundColor : "transparent", position : "absolute", left : (position.width -5) + "px"}} onMouseDown = {handleResizeRight}></div>
                <div className = "top-bottom-resizer" style = {{height : "5px", width : "100%", backgroundColor : "transparent", position : "absolute"}} onMouseDown = {handleResizeTop}/>
                <div className = "top-bottom-resizer" style = {{height : "5px", width : "100%", backgroundColor : "transparent", position : "absolute", top : (position.height -5) + "px"}} onMouseDown = {handleResizeBottom}/>

            </div>
        </div>
    )
}
export default Window;