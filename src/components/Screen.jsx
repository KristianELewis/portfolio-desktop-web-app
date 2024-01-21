import React, { useState , useRef, useEffect} from 'react'

import Window from './Window'
import Desktop from './Desktop';
import DesktopMenu from './DesktopMenu'
import LoginScreen from './LoginScreen';

import { defaultFileSystem } from './programs/FileManager/fileSystem';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import metaData from '../metaData';
/*======================================================================

    -I think the themeing stuff can be moved elsewhere. Probably in app.jsx

    -Colors can be auto generated with augmentColor, but it requires making themes twice or something
        -Seems over complicated for what I'm trying to do right now
        -This is described in the pallete section of the mui docs
        -This is a potential thing to refactor in the future. If I start adding more colors it will be usefull to have this system in place
            -It will be easier to just import colors from mui and have the light and dark versions auto made
            -Maybe Ill do that when I make a light mode



    -------------------------------------------------------------------

    This needs to be reorganized

======================================================================*/
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        orange: {
            main: "#ff3d00",
            light: "#ff6333",
            dark: "#b22a00", 
            contrastText: '#fff'
        },
        lightGray : {
            main: "#616161",
            light: "#757575",
            dark: "#424242", 
            contrastText: '#fff'
        },
        darkGray : {
            main: "#424242",
            light: "#616161",
            dark: "#212121", 
            contrastText: '#fff'
        },
    }
  });

import { processManagmentContext } from './Context';
//Wtf is this?
//import { Desk } from '@mui/icons-material';

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
    const [loggedIn, setLoggedIn] = useState(false);

    //const [file, setFile] = useState(null);
    //defaulFileSystem was here with no parenthesis before, was an accident I assume

    const FileSystem = useRef(defaultFileSystem());
    const [fileSystemState, setFileSystemState] = useState(1);
    //This could be combined with another state, maybe fileSystemState, as a regular state or maybe a reducer
    

    //QuickAccessList should be a part of the file system
    //These two things are messy. I should find a different way to do this
    const [quickAccessList, setQuickAccessList] = useState([
        {location : FileSystem.current, key : FileSystem.current.fullPath + FileSystem.current.id, name : "Home"},
        {location : FileSystem.current.children[0], key : FileSystem.current.children[0].fullPath + FileSystem.current.children[0].id, name : "Desktop"},
        {location : FileSystem.current.children[1], key : FileSystem.current.children[1].fullPath + FileSystem.current.children[1].id, name : "Documents"},
        {location : FileSystem.current.children[2], key : FileSystem.current.children[2].fullPath + FileSystem.current.children[2].id, name : "Pictures"}
    ])
    const [backgroundImageUrl, setBackgroundImageUrl] = useState(FileSystem.current.children[2].children[0].data.src)

    const addToQuickAccessList = (quickAccessItem) => {
        setQuickAccessList((prevState) => {
            if(prevState.findIndex(existingQuickItem => existingQuickItem.key === quickAccessItem.key) === -1){
                return [...prevState, quickAccessItem]
            }
            else return prevState
        })
    }
    const removeFromQuickAccessList = (key) => {
        setQuickAccessList(prevState => prevState.filter(item => item.key !== key))
    }

    //WindowPositionInUse puts a transparent div over image and pdf viewer
    //It is because Iframes will mess up css and js as its treated as a separate window
    //Probably not needed in image viewer. Not sure if Ill keep this, it can atleast be moved from here to closer to where it is used
    const [windowPositioningInUse, setWindowPositioningInUse] = useState(false);

    const screenDimensions = useWindowSize();
    const outerBorderWidth = 0;
    //const menuHeight = 64;
    const menuHeight = 40;
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

    //File manager uses the same kind of file as the other programs now

    //right now default sizes will need to be calculated with a function. Later I should use some Enum equivlant thing, or have better meta data storage

    const addProgram = (program, file) => {
        const processID = programCount.current;
        const tempZlevel = currentZLevel.current;
        currentZLevel.current += 1;
        programCount.current += 1;
        //File manager needs to be refactored before I can continue with ProgramIDs and meta data stuff
        const metaDataIndex = metaData.findIndex((element) => element.name === program) //this is temporary
        const programMetaData = metaData[metaDataIndex] //program should replace metaDataIndex soon
        const {defaultWidth, defaultHeight} = programMetaData.defaultDimensions;
        setPrograms((prevPrograms) => {
            return [...prevPrograms, { id: processID, zLevel: tempZlevel, name: program, file : file, defaultWidth : defaultWidth, defaultHeight : defaultHeight}]
        })
        //setProgramCount((prevState) => {return prevState+1})
        return processID
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
                //console.log(program.name)
                //console.log(file)
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

    const editProgramFileManager = (id, fileManagerId, file) => {
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
        const newProgramsFileManagerRemoved = newPrograms.filter((program) => {
            if (program.id != fileManagerId)
            {
                return program;
            }
            return 
        })
        setPrograms(newProgramsFileManagerRemoved)
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

    const displayPrograms = () => {
        console.log(programs)
    }

    /*================================================================================

    DESKTOP STUFF

    ================================================================================*/
    const desktopFolder = FileSystem.current.children[0];


    return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    {/* css baseline sets boxsizing to border-box in html, which was causing issues when calorie counter was being loaded.
    To fix this, I set border sizing to border box here and supply the innderwindow width with the borders removed */}
    
    <div className = "outterScreen" style = {{position: "relative", height : screenDimensions.height, width: screenDimensions.width, boxSizing : "border-box", touchAction : "none", userSelect : "none", overflow: "hidden"}}>
    {!loggedIn ? <LoginScreen loggedIn = {loggedIn} setLoggedIn = {setLoggedIn} dimensions = {{screenHeight : screenDimensions.height - outerBorderWidth , screenWidth : screenDimensions.width - outerBorderWidth}}/> :
        <>
        <div 
            className = "innerWindow" 
            onPointerMove = {mouseMove} 
            onPointerLeave = {mouseLeaveState} 
            onPointerUp = {mouseLeaveState} 
            style = {{
                height : (screenDimensions.height - outerBorderWidth - menuHeight) + "px",
                backgroundImage : `url('${backgroundImageUrl}')`,
                touchAction : "none",
                userSelect : "none"
            }}
            >

            <Desktop 
                desktopFolder = {desktopFolder}
                addProgram = {addProgram}
                editProgram = {editProgram}
                removeProgram = {removeProgram}
                editProgramFileManager = {editProgramFileManager}
                setFileSystemState = {setFileSystemState}
                addToQuickAccessList = {addToQuickAccessList}
            />

            <processManagmentContext.Provider value = {{addProgram : addProgram, removeProgram : removeProgram, editProgram : editProgram, editProgramFileManager : editProgramFileManager, programs :programs}}>
            {programs.map(program => {
                return (
                    //why aren't we using the other contexts here  instead of passing props?
                        <Window 
                            changeFunction = {changeFunction}
                            removeFunction = {removeFunction}
                            key = {program.id}
                            id = {program.id}
                            zLevel = {program.zLevel}
                            currentZLevel = {currentZLevel.current - 1}
                            name = {program.name}
                            file = {program.file}
                            screenWidth = {screenDimensions.width - outerBorderWidth}
                            screenHeight = {screenDimensions.height - outerBorderWidth - menuHeight}
                            defaultWidth = {program.defaultWidth}
                            defaultHeight = {program.defaultHeight}
                            windowPositioningInUse = {windowPositioningInUse}
                            FileSystem = {FileSystem}
                            fileSystemState = {fileSystemState}
                            setFileSystemState = {setFileSystemState}
                            quickAccessList = {quickAccessList}
                            addToQuickAccessList = {addToQuickAccessList}
                            removeFromQuickAccessList = {removeFromQuickAccessList}
                            focusWindow = {focusWindow}
                            addProgram = {addProgram}
                            removeProgram = {removeProgram}
                            editProgram = {editProgram}
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
        <DesktopMenu addProgram = {addProgram} removeProgram = {removeProgram} setBackgroundImageUrl = {setBackgroundImageUrl} displayPrograms = {displayPrograms} screenWidth = {screenDimensions.width - outerBorderWidth}/>
        </>
        }
    </div>
    </ThemeProvider>

    )
}
export default Screen