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
    const [position, setPosition] = useState({left: 50, top: 50, width: 300, height: 300, prevX : null, prevY : null})
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
    //Should it though? Initializations should be done with props, not useEffect. This can be done differently.
    useEffect(() => {
        if(props.screenWidth >= 720 && props.screenHeight >= 500){
            setPosition({left: 50, top: 50, width: 720, height: 500})
        }
        else{
            setPosition({left: 0, top: 0, width: props.screenWidth, height: props.screenHeight})
        }

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
            setProgram(<PdfReader></PdfReader>)
        }
        else if (props.name === "Image Viewer")
        {

            setProgram(<ImageViewer></ImageViewer>)
        }
        else if (props.name === "File Manager")
        {
            //pretty sure the add Program should be removed
            setProgram(<FileManager addProgram = {addProgram} version = "Standalone"></FileManager>)
        }
        else if (props.name === "Calorie Counter")
        {
            //When saving the file, this will reset position, not sure if it has a similar effect in normal use in anyway.
            //If it becomes an issue I can set this to use a previous state
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



    //not really necesasry
    const handlePointerup = (e) => {
        props.removeFunction()
    }
    const handlePointerDown = (e) => {
        setPosition((prevState) => {return {...prevState, prevX : e.clientX, prevY : e.clientY}})
        props.changeFunction( updatePointerPosition )

    }
    
    //mouse up may be redundant

    //position : "relative" must be placed in here. It is beining overwritten
    //padding also gets overwritten...


    const handleExit = () => {
        props.removeProgram(props.id)
    }
    const focusWindow = () => {
        //console.log("focus")
        props.focusWindow(props.id)
    }

    /*=================================================
        
        RESIZING
    
        These share a lot of functionality. Maybe The could be made more generic, But using previous state makes that hard.
        I could potentially move this into individual components, but that might add uncessary complexity, while mkaing it harder to follow.
        Although much of this is just the same kind of bounds checking. Maybe just put the bounds checking if statments into their own functions, and then use those in these functions

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
                {/* I think file system context can be brought up a level. 
                
                    You think? why the hell is this even in here. I need to bring this up a level. Desktop Icons aren't using this, I guess they're passed the values?
                    I guess I see why I just passed it down, but this seems weird and unecessary.
                    The use of context in this app is messy, I will need to deal with this

                    I will refactor this when I make a desktop component, for now it will stay
                
                    Man previous me was furious at previouser me
                */}
                <fileContext.Provider value = {{
                    FileSystem : FileSystem.current, 
                    fileSystemState : fileSystemState, 
                    setFileSystemState : setFileSystemState, 
                    quickAccessList : quickAccessList, 
                    addToQuickAccessList : addToQuickAccessList, 
                    removeFromQuickAccessList : removeFromQuickAccessList
                    }}>
                <programContext.Provider value = {{id: id, file : file, name : name, handlePointerDown : handlePointerDown, handleExit : handleExit}}>
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
                <div className= "left-right-resizer" style = {{height : "100%", width : "10px", backgroundColor : "transparent", position : "absolute", left: "-10px"}} onPointerDown = {handleResizeleft}></div>
                <div className= "left-right-resizer" style = {{height : "100%", width : "10px", backgroundColor : "transparent", position : "absolute", left : (position.width) + "px"}} onPointerDown = {handleResizeRight}></div>
                <div className = "top-bottom-resizer" style = {{height : "10px", width : "100%", backgroundColor : "transparent", position : "absolute", top : "-10px"}} onPointerDown = {handleResizeTop}/>
                <div className = "top-bottom-resizer" style = {{height : "10px", width : "100%", backgroundColor : "transparent", position : "absolute", top : (position.height) + "px"}} onPointerDown = {handleResizeBottom}/>
                {/*---------------
                CORNER RESIZERS
                +++++++++++++++++
                Bottom Right
                Top Left
                Top Right
                Bottom Left
                ---------------*/}
                <div className = "nwse-resizer" style = {{height : "15px", width : "15px", backgroundColor : "transparent", position : "absolute", left : (position.width -5) + "px", top : (position.height -5 ) + "px"}} onPointerDown = {handleResizeBottomRight}/>
                <div className = "nwse-resizer" style = {{height : "15px", width : "15px", backgroundColor : "transparent", position : "absolute", left : "-10px", top : "-10px"}} onPointerDown = {handleResizeTopLeft}/>
                <div className = "nesw-resizer" style = {{height : "15px", width : "15px", backgroundColor : "transparent", position : "absolute", left : (position.width -5) + "px", top : "-10px"}} onPointerDown = {handleResizeTopRight}/>
                <div className = "nesw-resizer" style = {{height : "15px", width : "15px", backgroundColor : "transparent", position : "absolute", left : "-10px", top : (position.height -5) + "px"}} onPointerDown = {handleResizeBottomLeft}/>
        </div>
    )
}
export default Window;