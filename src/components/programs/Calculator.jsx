/*===================================================

Just need a calculator for the sake of having one at the moment

This is fine for now but at some point I want to have it mirror the gnome calculator

===================================================*/
import React, {useState, useContext} from 'react'
import { windowWidthContext, programContext } from '../Context';

import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button'



const OperationButton = (props) => {
    const { char, handleOperator, gridArea } = props;
    const handleClick = () => {
        handleOperator(char)
    }
    return <Button color = "darkGray" variant = "contained" onClick = {handleClick} sx = {{gridArea : gridArea, fontSize : "18px"}}>{char}</Button>
}
const CharButton = (props) => {
    const { char, addCharToDisplay, gridArea } = props;
    const handleClick = () => {
        addCharToDisplay(char)
    }
    return <Button color = "lightGray" variant = "contained" onClick = {handleClick} sx = {{gridArea : gridArea, fontSize : "18px"}}>{char}</Button>
}

const Calculator = () => {
    const programInfo = useContext(programContext);
    const { file, id, name, handleMouseDown, handleExit } = programInfo;

    const [displayScreen, setDisplayScreen] = useState({value : "", isThereAPoint : false});
    const [previousValue, setPreviousValue] = useState("");
    const [operation, setOperation] = useState("");
    //const [isThereAPoint, setIsThereAPoint] = useState(false);

    const clearDisplay = () => {
        setDisplayScreen({value : "", isThereAPoint : false})
    }
    const addCharToDisplay = (char) => {
        setDisplayScreen((prevState) => {
            if(prevState.value === ""){
                return {value : char, isThereAPoint : prevState.isThereAPoint}
            }
            return {value : prevState.value + char, isThereAPoint : prevState.isThereAPoint}
        })
    }
    const handleOperator = (char) => {
        //If there's no previous value yet, and there is input
        if(previousValue === "" && displayScreen.value !== "")
        {
            setOperation(char)
            const displayHold = displayScreen.value
            setPreviousValue(displayHold)
            setDisplayScreen({value : "", isThereAPoint : false})
        }
        //If previousValue is not empty but the display is, then change the operation type
        else if(previousValue !== "" && displayScreen.value === ""){
            setOperation(char)
        }
        //if both values are set, and there is no operator yet, set previous value to screenvalue, reset screen value, set operator
        else if(previousValue !== "" && displayScreen.value !== "" && operation === ""){
            setOperation(char)
            const displayHold = displayScreen.value
            setPreviousValue(displayHold)
            setDisplayScreen({value : "", isThereAPoint : false})
        }
        else if(previousValue !== "" && displayScreen.value !== ""){
            evaluate()
            setOperation(char)
        }
        //if both have values it should evaluate the expression, the result set to previous value and then set the operator
    }
    const handlePointButton = () => {
        if(!displayScreen.isThereAPoint)
        {
            setDisplayScreen((prevState) => {
                if(prevState.value === ""){
                    return {value : "0.", isThereAPoint : true}
                }
                return {value : prevState.value + ".", isThereAPoint : true}
            })
        }
    }
    //This can obviously be improved, but I just need the logic down
    const evaluate = () => {
        if(previousValue !== "" && displayScreen.value !== "" && operation !== "")
        {
            if(operation === "+"){
                const result = parseFloat(previousValue) + parseFloat(displayScreen.value)
                setPreviousValue(result)
                setDisplayScreen({value : "", isThereAPoint : false})
                setOperation("")
            }
            else if(operation === "-"){
                const result = parseFloat(previousValue) - parseFloat(displayScreen.value)
                setPreviousValue(result)
                setDisplayScreen({value : "", isThereAPoint : false})
                setOperation("")
            }
            else if(operation === "/"){
                const result = parseFloat(previousValue) / parseFloat(displayScreen.value)
                setPreviousValue(result)
                setDisplayScreen({value : "", isThereAPoint : false})
                setOperation("")
            }
            else if(operation === "x"){
                const result = parseFloat(previousValue) * parseFloat(displayScreen.value)
                setPreviousValue(result)
                setDisplayScreen({value : "", isThereAPoint : false})
                setOperation("")
            }
        }
        console.log("evaluate")
    }


    const preventPositioning = (e) =>{
        e.stopPropagation()
    }
    return (
        <div className = "windowMidContainer" style = {{width : "100%"}}>
            {/*Top Bar */}
            <Paper position = "relative" sx = {{height : "40px", display : "flex", justifyContent : "space-between", alignItems : "center", borderRadius : "10px 10px 0 0"}} onMouseDown = {handleMouseDown}>
                <Typography sx = {{userSelect : "none", paddingLeft : "10px"}}>{ name }</Typography>
                <CloseIcon 
                    sx = {{
                        color : "white",
                        "&:hover": { backgroundColor: "black" }
                    }}
                    onClick = {handleExit}
                    onMouseDown = {preventPositioning}
                />
            </Paper>
            {/*Was trying to avoid using flexbox, but its just easier to use it*/}
            <Paper elevation = {0} sx = {{ display : "flex", height: "100%", overflow: 'auto', alignItems: "center", justifyContent : "center", borderRadius : "0 0 10px 10px"}}>
                <Paper elevation = {3} sx = {{display : "inline-block", padding: "25px", borderRadius : "10px 10px 10px 10px"}}>
                    <Paper variant = "outlined" sx = {{height : "128px", textAlign : "right"}}>
                        {/*I had typography here before but it had a background that was covering the paper component
                            This can be a scrolling screen with a history
                        */}
                        <p style = {{ paddingTop : "14px", paddingBottom : "14px", paddingRight: "10px", margin: "0px", minHeight : "56px"}}>
                            {previousValue}
                        </p>
                        <p style = {{paddingRight: "10px", margin: "0px", minHeight : "24px"}}>
                            {operation}
                        </p>
                        <p style = {{paddingTop : "14px", paddingBottom : "14px", paddingRight: "10px", margin: "0px"}}>
                            {displayScreen.value}
                        </p>
                    </Paper>
                    {/*This div holds the buttons */}
                    <div style = {{
                        display: "grid", 
                        gridTemplateAreas : '"plus minus multiply divide" "seven eight nine equals" "four five six equals" "one two three equals" "zero point clear equals"',
                        gridTemplateRows : "50px 50px 50px 50px 50px",
                        gridTemplateColumns: "75px 75px 75px 75px",
                        gridRowGap : "5px",
                        gridColumnGap : "5px",
                        marginTop: "5px"
                        }}
                    >
                        <OperationButton char = "+" gridArea = "plus" handleOperator = {handleOperator}/>
                        <OperationButton char = "-" gridArea = "minus" handleOperator = {handleOperator}/>
                        <OperationButton char = "x" gridArea = "multiply" handleOperator = {handleOperator}/>
                        <OperationButton char = "/" gridArea = "divide" handleOperator = {handleOperator}/>
                        <CharButton char = "7" gridArea = "seven" addCharToDisplay = {addCharToDisplay}/>
                        <CharButton char = "8" gridArea = "eight" addCharToDisplay = {addCharToDisplay}/>
                        <CharButton char = "9" gridArea = "nine" addCharToDisplay = {addCharToDisplay}/>
                        <CharButton char = "4" gridArea = "four" addCharToDisplay = {addCharToDisplay}/>
                        <CharButton char = "5" gridArea = "five" addCharToDisplay = {addCharToDisplay}/>
                        <CharButton char = "6" gridArea = "six" addCharToDisplay = {addCharToDisplay}/>
                        <CharButton char = "1" gridArea = "one" addCharToDisplay = {addCharToDisplay}/>
                        <CharButton char = "2" gridArea = "two" addCharToDisplay = {addCharToDisplay}/>
                        <CharButton char = "3" gridArea = "three" addCharToDisplay = {addCharToDisplay}/>
                        <CharButton char = "0" gridArea = "zero" addCharToDisplay = {addCharToDisplay}/>
                        <Button color = "darkGray" variant = "contained" sx={{gridArea : "point", fontSize : "18px"}} onClick = {handlePointButton}>.</Button>
                        <Button color = "darkGray" variant = "contained" sx={{gridArea : "clear", fontSize : "18px"}} onClick = {clearDisplay}>ce</Button>
                        <Button color = "orange" variant = "contained" sx={{gridArea : "equals", fontSize : "18px"}} onClick = {evaluate}>=</Button>
                    </div>    
                </Paper>
            </Paper>
        </div>
    )
}

export default Calculator;