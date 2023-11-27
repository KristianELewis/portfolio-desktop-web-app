import React, {useContext} from 'react'

import { programContext } from '../../Context';

import SoundBoard from './components/SoundBoard'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close';

const PianoSynthJS = () => {

    const programInfo = useContext(programContext);
    const { file, id, name, handlePointerDown, doubleClickResize, handleExit } = programInfo;

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
                <CloseIcon 
                    sx = {{
                        justifySelf : "end",
                        color : "white",
                        "&:hover": { backgroundColor: "black" }
                    }}
                    onClick = {handleExit}
                    onPointerDown = {preventPositioning}
                />
            </Paper>
            <Paper elevation = {0} style = {{height: "100%", overflow: 'auto', borderRadius : "0 0 10px 10px"}}>
                <SoundBoard/>
            </Paper>
        </div>
    )
}

export default PianoSynthJS;