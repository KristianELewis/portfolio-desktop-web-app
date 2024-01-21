import React, {useContext} from 'react'

import { programContext, windowWidthContext } from '../../Context';

//import SoundBoard from './components/SoundBoard'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TopBarButtons from '../../topBarComponents/TopBarButtons';
/*
Mayube I could make use of the IsFocused thing for keyboard events
*/
const PianoSynthJS = () => {

    const programInfo = useContext(programContext);
    const { file, id, name, handlePointerDown, doubleClickResize, handleExit, inFocus } = programInfo;
    const { windowPositioningInUse, }= useContext(windowWidthContext)

    const handlePointerDownTopBar = (e) => {
        handlePointerDown(e)
        doubleClickResize()
    }
    const preventPositioning = (e) =>{
        e.stopPropagation()
    }

    return (
        <div className = "windowMidContainer" style = {{width : "100%"}}>
            <Paper position = "relative" sx = {{height : "40px", padding: "0 5px 0 5px", boxSizing : "border-box", borderRadius : "10px 10px 0 0" , display : "grid", gridTemplateColumns : "1fr 1fr", alignItems : "center"}} onPointerDown = {handlePointerDownTopBar}>
                <Typography noWrap sx = {{width : "100%", userSelect : "none", paddingLeft : "10px", justifySelf : "start"}}>{ name }</Typography>
            
                <TopBarButtons program = {2} handleExit = {handleExit} preventPositioning = {preventPositioning}/>
            </Paper>
            <Paper elevation = {0} style = {{position : "relative", height: "100%", borderRadius : "0 0 10px 10px" }} >
                {windowPositioningInUse && <div style = {{position: "absolute", backgroundColor: "transparent", height : "100%", width: "100%", boxSizing : "border-box"}}></div>}
                
                {/*Anything that uses iframes should have this to allow for refocusing */}
                {!inFocus && <div style = {{position: "absolute", backgroundColor: "transparent", height : "100%", width: "100%", boxSizing : "border-box"}}></div>}
                <iframe src="https://kristianlewis.com/PianoSynthJS/" height = {"100%"} width = {"100%"} style = {{borderRadius : "0 0 10px 10px", border : "none"}}></iframe>
                {/*<SoundBoard/>*/}
            </Paper>
        </div>
    )
}

export default PianoSynthJS;