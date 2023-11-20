import { useState } from 'react'

/*
Probably easiest way to do this would be to have two types of keys
white key for regular notes and a black key for the sharps and flats

Should changhe this filename to Key

easiest way to get hover on keys, was to make a keys class and in the app.css add a hover option. Really need to get a css style engine

*/

 const WhiteKey = (props) => {

    const {handleClick, placement} = props;
    const left = (42 * placement);
    return (
        <div
            className = "keys"
            onClick = {handleClick}
            style = {{
                width : "40px", 
                height : "100px", 
                backgroundColor : "white", 
                position : "absolute",
                border : "1px black solid",
                top : "0px",
                left : left + "px"
                }}>
            
        </div>
    )
}

const BlackKey = (props) => {

    const {handleClick, placement} = props;
    const left = (42 * placement) - 11;
    return (
        <div
            className = "keys"
            onClick = {handleClick}
            style = {{
                width : "22px", 
                height : "70px", 
                backgroundColor : "black", 
                position : "absolute",
                top : "0px",
                left : left + "px"
                }}>

        </div>
    )
}
const SoundButton = (props) => {
    const {sliderAmount, handleButtonClick, noteInfo} = props;
    const {baseFrequency, note, type, placement} = noteInfo;
    /*{
        context : currentAudioContext,
        oscilator : o,
        gain : g
    }*/


    const handleClick = () => {
        handleButtonClick({baseFrequency: baseFrequency})
    }
    return ( <>
        {type === 0 ? <WhiteKey handleClick = {handleClick} note = {note} placement = {placement}/> : <BlackKey handleClick = {handleClick} note = {note} placement = {placement}/>}
    </>
    )
}
export default SoundButton;
//onPointerDown = {handlePointerDown}  onPointerUp = {handlePointerUp}

//        <WhiteKey handleClick = {handleClick} note = {note}/>


/*


------This is some old stuff from when I was trying continuos sound, worth looking at if I try again

const [soundState, setSoundState] = useState(null);

const handlePointerDown = () => {
    if(soundState!== null)
    {
        setSoundState(prevState => {
            prevState.oscilator.stop();
            //prevState.context.close()
            return null
        })
    }
    let audioContext = new AudioContext()
    let o = audioContext.createOscillator()
    let g = audioContext.createGain()
    o.connect(g)
    o.type = "sine"
    o.frequency.value = baseFrequency * Math.pow(2, sliderAmount);
    g.connect(audioContext.destination)
    o.start(0);
    setSoundState({
        context : audioContext,
        oscilator : o,
        gain : g
    });
}

const handlePointerUp = () => {
    if(soundState !== null)
    {
        //soundState.stop();
        soundState.gain.gain.exponentialRampToValueAtTime(
            0.00001, soundState.context.currentTime + .1
        )
        setTimeout(() => setSoundState(prevState => {
            prevState.oscilator.stop();
            //prevState.context.close()
            return null
        }),
        100
        )

    }
}

*/