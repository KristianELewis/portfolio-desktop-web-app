import React, {useState} from 'react'


const Calculator = () => {
    const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3]

    return (
        <div style = {{height: "100%", overflow: 'auto', backgroundColor: 'orange'}}>

            <div 
                className = "calculatorDisplay"
                style={{display: "flex", flexDirection: "column", alignItems: "flex-end", boxSizing: "border-box", padding : "10px"}}    
            >
                <p>Output</p>
                <p>input</p>
            </div>
            <h1>test</h1>
    
        </div>
    )
}


export default Calculator;