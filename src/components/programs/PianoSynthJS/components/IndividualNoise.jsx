import { useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const IndividualNoise = (props) => {
    const {audioContext, dispatchSound, id} = props;
    const [playOrStop, setPlayOrStop] = useState("Play")
    const [soundState, setSoundState] = useState(null)
    const [waveType, setWaveType] = useState("sine")
    const [frequencyRange, setFrequencyRange] = useState(4);
    const [gain, setGain] = useState(50);
    let baseFrequency = 16.35;

    const handlePlayOrStop = () => {
        if(playOrStop === "Play")
        {
            if(soundState === null)
            {
                let o = audioContext.createOscillator()
                let g = audioContext.createGain()
                o.connect(g)
                o.type = waveType;
                o.frequency.value = baseFrequency * Math.pow(2, frequencyRange);
                g.connect(audioContext.destination)
                o.start();
                g.gain.setValueAtTime(gain /100, audioContext.currentTime);
                setSoundState({o : o, g : g})
                setPlayOrStop("Stop")
                console.log("yuh")
            }
        }
        else{
            if(soundState !== null){
                soundState.o.stop();
                setSoundState(null)
                setPlayOrStop("Play")
            }
        }
    }
    const handleFrequencyRange = (e) => {
        if(soundState !==null){
            soundState.o.frequency.setValueAtTime((baseFrequency * Math.pow(2, e.target.value)), audioContext.currentTime)
        }
        setFrequencyRange(e.target.value)
        dispatchSound({type : "ChangeFrequencyRange", frequencyRange : e.target.value, id : id})
    }
    const handleGain = (e) => {
        if(soundState !==null){
            soundState.g.gain.setValueAtTime(e.target.value /100, audioContext.currentTime);
        }
        setGain(e.target.value)
        dispatchSound({type : "ChangeGain", gain : e.target.value, id : id})

    }
    const handleWaveTypeChange = (e) => {
        if(soundState !==null){
            soundState.o.type = e.target.value;
        }
        setWaveType(e.target.value)
        dispatchSound({type : "ChangeWaveType", waveType : e.target.value, id : id})
    }
    const handleDelete = () => {
        dispatchSound({type : "DeleteSound", id : id})
    }

    /*
        These accordians have some annoying styling when multiples are put together
        There is some annoying styling here in general


    */
    return (
        <Accordion sx = {{marginBottom:"16px", width: "300px"}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{waveType.charAt(0).toUpperCase() + waveType.slice(1)} Wave</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>Base Frequency C: {baseFrequency * Math.pow(2, frequencyRange)}</Typography>
                <div>
                    <Typography>Frequency Range: {frequencyRange}</Typography>
                    <Slider step={1} min = {0} max = {8} onChange = {handleFrequencyRange} value = {frequencyRange}/>
                </div>
                <div>
                    <Typography>Volume: {gain}</Typography>
                    <Slider step={1} min = {0} max = {100} onChange = {handleGain} value = {gain}/>
                </div>
                <div style = {{display: "flex", justifyContent : "space-between", alignContent : "center", alignItems : "center"}}>
                    <Typography>Wave Type:</Typography>
                    <Select onChange = {handleWaveTypeChange} value = {waveType} size="small">
                        <MenuItem value="sine">sine</MenuItem>
                        <MenuItem value="square">square</MenuItem>
                        <MenuItem value="sawtooth">sawtooth</MenuItem>
                        <MenuItem value="triangle">triangle</MenuItem>
                    </Select>
                </div>
                <div style = {{marginTop: "10px", display: "flex", justifyContent : "space-between"}}>
                    <Button variant="outlined" onClick = {handlePlayOrStop} >{playOrStop}</Button>
                    <Button variant="outlined" onClick = {handleDelete} >remove sound</Button>
                </div>
            </AccordionDetails>
        </Accordion>
    )
}

export default IndividualNoise;