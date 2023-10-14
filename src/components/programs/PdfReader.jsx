import React, {useState, useContext} from 'react'
import { windowWidthContext } from '../Context';

/*========================================================================

TODO

for now I will just use an iframe, It seems to work well. Just need to put a transparent div in front of the iframe when moving or resizing 

This file should be improved whem a file/folder system is implemented

Whenm no pdf is loaded, I need to have some sort of menu system to load a pdf from the programs local files

========================================================================*/


import file from './Resume.pdf'
//This shouldnt load files like this in the future. need to get the files from public or local storage when I figure out how that works



// see if you can do an onlick for the iframe, if yes then make that focus it

const PdfReader = () => {
    const {windowPositioningInUse }= useContext(windowWidthContext)
    return(
        <div style = {{height: "100%", color : "black", position: "relative"}}>
            {windowPositioningInUse && <div style = {{position: "absolute", backgroundColor: "transparent", height : "100%", width: "100%", boxSizing : "border-box"}}></div>}
            <iframe src = {file} height = {"100%"} width = {"100%"} style = {{boxSizing : "border-box"}}></iframe>
        </div>
    )
}

export default PdfReader;

