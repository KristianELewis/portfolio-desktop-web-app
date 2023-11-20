import { useState, useEffect } from 'react'
import SoundButton from './SoundButton';
import KeyboardInput from './KeyboardInput'

import notes from '../notes'



const Keyboard = (props) => {

    const {handleButtonClick} = props

    //Easiest way to keep the keyboard centered is to use flex
    return (
        <div style = {{textAlign : "center"}}>
            <div id="keys" style = {{position : "relative", width : "294px", height : "100px"}}>
                {notes.map((freqChild) => {
                    if(freqChild.type === 0) return <SoundButton key = {freqChild.note} handleButtonClick = {handleButtonClick} noteInfo = {freqChild}/>
                })}
                {notes.map((freqChild) => {
                    if(freqChild.type === 1) return <SoundButton key = {freqChild.note} handleButtonClick = {handleButtonClick} noteInfo = {freqChild}/>
                })}
            </div>
            <KeyboardInput handleButtonClick = {handleButtonClick}/>
        </div>
    )
}

export default Keyboard