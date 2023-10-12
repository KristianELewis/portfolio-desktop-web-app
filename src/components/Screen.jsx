import React, { useState , useRef, useEffect} from 'react'

import Window from './Window'
import DesktopMenu from './DesktopMenu'

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

    //console.log("screen render")

    const screenDimensions = useWindowSize();
    const outerBorderWidth = 20;
    const menuHeight = 64;

    /*=================================================

        MULTIPLE PROGRAM FUNCTIONALITY

    ==================================================*/

    const [programs, setPrograms] = useState([]);
    //useRef??
    //const [programCount, setProgramCount] = useState(0);
    let programCount = useRef(0)
    let currentZLevel = useRef(0)

    const addProgram = (name) => {
        setPrograms((prevPrograms) => {
            const tempProgramCount = programCount.current
            const tempZlevel = currentZLevel.current;
            currentZLevel.current += 1;
            programCount.current +=1
            return [...prevPrograms, { id: tempProgramCount, zLevel: tempZlevel, name: name}]
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
                    name: program.name
                }
            }
            return program
        })
        currentZLevel.current += 1;
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
        window.getSelection().empty()
        setMouseMove(() => newFunc);
        setMouseLeaveState(() => removeFunction)
    }
    //this function will stop tracking the mouse
    const removeFunction = () =>{
        //window.getSelection().empty() is necessary to prevent dragging issues when moving a window
        //if the user is dragging a window, and the mouse moves beyond the windowEdge, it will begin selecting text, or elements undeneath the mouse
        //this will happen when trying to drag a window beyond the screen boundries. The browser will think the user was selecting something.
        //if the user tries to move a window again, they will instead begin to drag the selection. This sets the selection to null, so no draggin operation will occur
        window.getSelection().empty()
        setMouseMove(null);
        setMouseLeaveState(null);
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
            {programs.map(program => {
                return (
                        <Window 
                            changeFunction = {changeFunction}
                            removeFunction = {removeFunction}
                            key = {program.id}
                            id = {program.id}
                            zLevel = {program.zLevel}
                            name = {program.name}
                            screenWidth = {screenDimensions.width - outerBorderWidth}
                            screenHeight = {screenDimensions.height - outerBorderWidth - menuHeight}
                            screenDimensions = {screenDimensions}
                            removeProgram = {removeProgram}
                            focusWindow = {focusWindow}
                        />
                )
            })}

        </div>    
    </div>
    )
}
export default Screen