import React, { useState , useRef, useEffect} from 'react'

import Window from './Window'
import DesktopMenu from './DesktopMenu'
import { Folder, File } from './programs/fileSystem';


import { processManagmentContext } from './Context';

//This custom hook is so good
//Someone elses custom hook
//https://stackoverflow.com/questions/71457792/resize-event-in-react
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      // Add event listener
      window.addEventListener("resize", handleResize);
      // Call handler right away so state gets updated with initial window size
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }


function Screen() {

    const [backgroundImageUrl, setBackgroundImageUrl] = useState(null)

    const [file, setFile] = useState(null);

    const FileSystem = useRef(new Folder("Home", null, 0, ""))
    const [fileSystemState, setFileSystemState] = useState(1);
    //console.log("from screen: " + fileSystemState)

    //Right now this is only used in the pdf reader. This lets the window know that a movement operation is in place. This puts a transparent div over the iframe
    //This will stop the iframe from interupting movement and resizing operations.
    //This could potentially move into window. It may also be completely uncessary, but for the sake of time and to reduce the programs overhead, I just want a working pdf reader
    const [windowPositioningInUse, setWindowPositioningInUse] = useState(false);

    const screenDimensions = useWindowSize();
    const outerBorderWidth = 20;
    const menuHeight = 64;

    /*=================================================

        MULTIPLE PROGRAM FUNCTIONALITY


        This would be great for redux I think
        I think thi stuff can be provided with context?
    ==================================================*/

    const [programs, setPrograms] = useState([]);
    //useRef??
    //const [programCount, setProgramCount] = useState(0);
    let programCount = useRef(0)
    let currentZLevel = useRef(0)

    //instead of this being file, it could be data/metaData or something.
    //for folderManager the "file" variable wouldn't hold a file, it could hold the current file manager function
    //so within text editor when you click save or load it would make a new program with that function as data.
    //although file manager withing the text file should probably be its own thing
    const addProgram = (name, file) => {
        setPrograms((prevPrograms) => {
            const tempProgramCount = programCount.current
            const tempZlevel = currentZLevel.current;
            currentZLevel.current += 1;
            programCount.current +=1
            return [...prevPrograms, { id: tempProgramCount, zLevel: tempZlevel, name: name, file : file}]
        })
        //setProgramCount((prevState) => {return prevState+1})
    }

    const removeProgram = (id) => {
        //const newPrograms = programs
        const newPrograms = programs.filter((program) => {
            if (program.id != id)
            {
                return program;
            }
            return 
        })
        setPrograms(newPrograms)
    }
    //It needs to use zIndexes. zIndexes will  revent the user from selecting the windows behind. pushing the current window to the back of the programs list
    //and therefore render later in the dom, will still allow the background elements to be selected
    const focusWindow = (id) => {
        const newPrograms = programs.map((program) => {
            if(program.id === id)
            {
                return {
                    id: program.id,
                    zLevel: currentZLevel.current,
                    name: program.name,
                    file : program.file
                }
            }
            return program
        })
        currentZLevel.current += 1;
        setPrograms(newPrograms)
    }

    const editProgram = (id, file) => {
        const newPrograms = programs.map((program) => {
            if(program.id === id)
            {
                return {
                    id: program.id,
                    zLevel: program.zLevel,
                    name: program.name,
                    file : file

                }
            }
            return program
        })
        setPrograms(newPrograms)
    }
    /*========================================================

    MOUSE TRACKING AND WINDOW POSITIONING

    TODO
    clean up these comments, put them in here. This code is hard to read

    a priority is to reduce unecessary renders

    ========================================================*/
    const [mouseLeaveState, setMouseLeaveState] = useState(null)
    const [mouseMove, setMouseMove] = useState(null)
    //this function will track the mouse. It is inteded to be used with a window postitioning function. When the mouse moves on screen
    //it will call a windows positioning function and move that window. If the mouse is let go or the mouse leaves the screen, it will stop tracking
    const changeFunction = (newFunc) => {
        //console.log("changeFunction")
        //see explanation in removeFunction. It is necessary here aswell
        window.getSelection().empty();
        setMouseMove(() => newFunc);
        setMouseLeaveState(() => removeFunction);
        setWindowPositioningInUse(true);
    }
    //this function will stop tracking the mouse
    const removeFunction = () =>{
        //window.getSelection().empty() is necessary to prevent dragging issues when moving a window
        //if the user is dragging a window, and the mouse moves beyond the windowEdge, it will begin selecting text, or elements undeneath the mouse
        //this will happen when trying to drag a window beyond the screen boundries. The browser will think the user was selecting something.
        //if the user tries to move a window again, they will instead begin to drag the selection. This sets the selection to null, so no draggin operation will occur
        window.getSelection().empty();
        setMouseMove(null);
        setMouseLeaveState(null);
        setWindowPositioningInUse(false);
    }

    //css baseline sets boxsizing to border-box in html, which was causing issues when calorie counter was being loaded.
    //To fix this, I set border sizing to border box here and supply the innderwindow width with the borders removed
    return (
    <div className = "outterScreen" style = {{width: screenDimensions.width, boxSizing : "border-box"}}>
        <DesktopMenu addProgram = {addProgram} setBackgroundImageUrl = {setBackgroundImageUrl}/>

        <div 
            className = "innerWindow" 
            onPointerMove = {mouseMove} 
            onMouseLeave = {mouseLeaveState} 
            onMouseUp = {mouseLeaveState} 
            style = {{
                height : (screenDimensions.height - outerBorderWidth - menuHeight) + "px",
                backgroundImage : `url('${backgroundImageUrl}')`
            }}
            >
            {/* WHen desktop Icons are implemented they should be placed here in a map function */}
            
            <processManagmentContext.Provider value = {{addProgram : addProgram, removeProgram : removeProgram, editProgram : editProgram, programs :programs}}>
            {programs.map(program => {
                return (
                        <Window 
                            changeFunction = {changeFunction}
                            removeFunction = {removeFunction}
                            key = {program.id}
                            id = {program.id}
                            zLevel = {program.zLevel}
                            name = {program.name}
                            file = {program.file}
                            screenWidth = {screenDimensions.width - outerBorderWidth}
                            screenHeight = {screenDimensions.height - outerBorderWidth - menuHeight}
                            screenDimensions = {screenDimensions}
                            windowPositioningInUse = {windowPositioningInUse}
                            FileSystem = {FileSystem}
                            fileSystemState = {fileSystemState}
                            setFileSystemState = {setFileSystemState}
                            addProgram = {addProgram}
                            editProgram= {editProgram}
                            removeProgram = {removeProgram}
                            focusWindow = {focusWindow}
                        />
                        /* 
                            remove addProgram removeProgram focuswindow and editProgram, put them in context 
                            screen dimensions can be put in a context 
                            just send program over and destructure it in the window

                        */
                        /*Okay windowPositioningInUse should probably just be placed elsewhere */

                )
            })}
        </processManagmentContext.Provider>
        </div>    
    </div>
    )
}
export default Screen