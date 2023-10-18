import React, { useState , useRef, useEffect} from 'react'

import Window from './Window'
import DesktopMenu from './DesktopMenu'
import { Folder, File, defaultFileSystem } from './programs/FileManager/fileSystem';

import FileComp from './programs/FileManager/FileComp'
import FolderComp from './programs/FileManager/FolderComp'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

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

    //const [file, setFile] = useState(null);
    //defaulFileSystem was here with no parenthesis before, was an accident I assume

    const FileSystem = useRef(defaultFileSystem());
    const [fileSystemState, setFileSystemState] = useState(1);
    //This could be combined with another state, maybe fileSystemState, as a regular state or maybe a reducer
    const [quickAccessList, setQuickAccessList] = useState([
        {location : FileSystem.current, key : FileSystem.current.fullPath + FileSystem.current.id, name : "Home"},
        {location : FileSystem.current.children[0], key : FileSystem.current.children[0].fullPath + FileSystem.current.children[0].id, name : "Desktop"},
        {location : FileSystem.current.children[1], key : FileSystem.current.children[1].fullPath + FileSystem.current.children[1].id, name : "Documents"},
        {location : FileSystem.current.children[2], key : FileSystem.current.children[2].fullPath + FileSystem.current.children[2].id, name : "Pictures"}
    ])
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
        const programID = programCount.current;
        setPrograms((prevPrograms) => {
            const tempProgramCount = programCount.current
            const tempZlevel = currentZLevel.current;
            currentZLevel.current += 1;
            programCount.current +=1
            return [...prevPrograms, { id: tempProgramCount, zLevel: tempZlevel, name: name, file : file}]
        })
        //setProgramCount((prevState) => {return prevState+1})
        return programID
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
                console.log(program.name)
                console.log(file)
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

    const handleFolderClick = (id) => {
        //this is temporary to get it working
        //requestData should be renamed to starting location
        //all of this data should be rearranged for its version type, It should be called payload
        //This is just too much shit to have here
        const location = desktopFolder.children[id]
        addProgram("File Manager", {
            version : "Standalone", 
            clickFunction : null, 
            requestID : null, 
            requestData : location, 
            acceptableType : null, 
            programHandler : null, 
            requestCanceler : null
        })
    }

    return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    {/* css baseline sets boxsizing to border-box in html, which was causing issues when calorie counter was being loaded.
    To fix this, I set border sizing to border box here and supply the innderwindow width with the borders removed */}
    <div className = "outterScreen" style = {{width: screenDimensions.width, boxSizing : "border-box"}}>
        <DesktopMenu addProgram = {addProgram} removeProgram = {removeProgram} setBackgroundImageUrl = {setBackgroundImageUrl} displayPrograms = {displayPrograms}/>

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

            {/* This should be made into its own component at some point. When that is done right click functionality should be implemented */}
            <div style = {{ display : "flex", flexBasis : "100px", flexDirection : "column",  flexFlow : "column wrap", flexGrow : 0, alignContent : "start", minHeight : "100%", maxHeight : "100%", overflow : "hidden"}}>
                {desktopFolder.children.filter(child => {
                    if(child.type === "Folder")
                    {
                        return child;
                    }
                    return
                    }).map((child) => {
                        return (
                            <FolderComp 
                                key = {child.id} 
                                file = {child}
                                traverse = {handleFolderClick} 
                                />
                        )
                    })}
                    {/*Files Gettin non no ids for files?>*/}
                {desktopFolder.children.filter(child => {
                    if(child.type !== "Folder")
                    {
                        return child;
                    }
                    return
                }).map((child) => {
                    return (
                        //Most of this stuff is no necessary for desktop
                        <FileComp 
                            key = {child.id} 
                            file = {child}
                            addProgram = {addProgram}
                            editProgram = {editProgram}
                            removeProgram = {removeProgram}
                            editProgramFileManager = {editProgramFileManager}
                            version = {"Standalone"}
                            requestID = {null}
                            requestData = {null}
                            acceptableType = {null}
                            programHandler = {null}
                            fileManagerId = {null}
                            />
                    )
                })}
            </div>
            <processManagmentContext.Provider value = {{addProgram : addProgram, removeProgram : removeProgram, editProgram : editProgram, editProgramFileManager : editProgramFileManager, programs :programs}}>
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
                            quickAccessList = {quickAccessList}
                            addToQuickAccessList = {addToQuickAccessList}
                            removeFromQuickAccessList = {removeFromQuickAccessList}
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
    </ThemeProvider>

    )
}
export default Screen