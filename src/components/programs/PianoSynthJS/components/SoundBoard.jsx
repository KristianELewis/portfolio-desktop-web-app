import { useState, useRef, useEffect, useReducer } from 'react'
import IndividualNoise from './IndividualNoise';
import Keyboard from './Keyboard';
import Button from '@mui/material/Button';

/*
    Im gonna completely rework this soon. The accordian nonsense is annoying me, probably want different event handling for the keyboard, and maybe more options for continous noise and what not

*/

function soundReducer(state, action) {
    switch (action.type){
        case "AddSound":
            return [...state, {id : action.id, waveType : "sine", gain : 50, octave : 4}]
        case "DeleteSound":
            const index = state.findIndex(sound => sound.id === action.id)
            const newarr = state.toSpliced(index, 1)
            return newarr
        case "ChangeWaveType":
            let newSoundState = state.map(sound => {
                if (sound.id === action.id)
                {
                    return {...sound, waveType : action.waveType}
                }
                else{
                    return sound
                }
            })
            return newSoundState
        case "ChangeGain":
            let newSoundStateG = state.map(sound => {
                if (sound.id === action.id)
                {
                    return {...sound, gain : action.gain}
                }
                else{
                    return sound
                }
            })
            return newSoundStateG
        case "ChangeOctave":
            let newSoundStateF = state.map(sound => {
                if (sound.id === action.id)
                {
                    return {...sound, octave : action.octave}
                }
                else{
                    return sound
                }
            })
            return newSoundStateF
    }
}

const SoundBoard = () => {
    const id = useRef(-1);
    const [audioContext, setAudioContext] = useState(() => {return new AudioContext()})
    const [sounds, dispatchSound] = useReducer(soundReducer, [])
    let baseFrequency = 16.35;
    
    const handleAddNewSound = () => {
        id.current++;
        dispatchSound({type: "AddSound", id : id.current})
    }
    const handleButtonClick = (params) => {
        const {baseFrequency} = params;
        for(const sound of sounds)
        {
            let o = audioContext.createOscillator()
            let g = audioContext.createGain()
            o.connect(g)
            o.type = sound.waveType
            o.frequency.value = baseFrequency * Math.pow(2, sound.octave);
            g.connect(audioContext.destination)
            o.start();
            g.gain.setValueAtTime(sound.gain /100, audioContext.currentTime);
            g.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.9)
            o.stop(audioContext.currentTime + 1)
        }
    }
    return (
        <div style = {{ height : "100%", minHeight: "400px", display : "flex", flexDirection : "column", justifyContent : "center", alignItems : "center"}}>

                <div style = {{display: "flex", flexDirection : "column", alignItems : "center", boxSizing : "border-box", paddingTop : "10px", paddingBottom : "10px", marginBottom : "10px", width : "325px", maxHeight : "350px", overflow : "auto", border: "grey 1px", borderStyle : "solid none solid none "}}>
                    {sounds.map((sound) => {
                        return(
                            <IndividualNoise key = {sound.id} audioContext = {audioContext} dispatchSound = {dispatchSound} id = {sound.id}/>
                        )
                    })}
                    <Button variant="outlined" sx ={{width : "294px"}} onClick = {handleAddNewSound}>Add New Sound</Button>
                </div>
                <Keyboard handleButtonClick = {handleButtonClick}></Keyboard>

        </div>
    )
}
export default SoundBoard;


//<SoundButton key = {freqChild.note} handleButtonClick = {handleButtonClick} sliderAmount = {sliderAmount} baseFrequency = {freqChild.frequency} letter = {freqChild.letter} note = {freqChild.note}/>

// setSounds(prevState => {
//     return [...prevState, {audioContext : audioContext}]
// })
// }
// return (
// <div>
//     {sounds.map((freqChild) => {
//         return(
//             <IndividualNoise audioContext = {freqChild.audioContext}/>