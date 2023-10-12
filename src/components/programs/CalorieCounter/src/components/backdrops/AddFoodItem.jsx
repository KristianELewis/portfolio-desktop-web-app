import React, {useState} from "react";

import Backdrop from '@mui/material/Backdrop';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";

import "../../stylesheets/addFoodItem.css"

import {addNewFoodItemConnect} from '../../serverFunctions/serverFunctions.jsx'

/*
Its okay as is right, still not super happy about the way it looks

if successful, it should say so and allow the user to add the item to a meal



className = "AddFoodItemFieldsTextfield"
*/


const ServingSizeAndUnit = (props) => {

    const servingSizeValue = props.servingSizeValue
    const servingUnitValue = props.servingSizeUnitValue

    const servingSizeSetter = props.servingSizeSetter
    const servingUnitSetter = props.servingSizeUnitSetter

    const sizeChangeFunc = (event) => {
        if(event.target.value >= 0)
        {
            servingSizeSetter(event.target.value)
        }
    }

    const unitChangeFunc = (event) => {
        servingUnitSetter(event.target.value)
    }

    return(
        <div 
            className = "mealItemInfoSubDiv"
            style = {{
                display : "flex",
                justifyContent : "space-between",
                marginTop: "5px"

            }}
        >
            <p style = {{margin : "0px",  marginTop : "5px"}} >Serving Size</p>
            <div>
                <TextField 
                    value = {servingSizeValue} 
                    type = "number"
                    margin="dense"
                    size = "small"
                    onChange = {sizeChangeFunc}
                    
                    sx = {{
                        width : "100px",
                        textAlign : "right",
                        margin : "0px"
                    }} 
                />
                <TextField 
                    value = {servingUnitValue} 
                    label = "unit"
                    type =  "text"
                    margin="dense"
                    size = "small"
                    onChange = {unitChangeFunc}
                    
                    sx = {{
                        width : "75px",
                        textAlign : "right",
                        margin : "0px"
                    }} 
                />
            </div>        
        </div>
    )
}

const InformationInput = (props) => {
    const name = props.name;
    const value = props.value;
    const setter = props.setter
    const type = props.type

    let changeFunc;
    if (type === "number")
    {
        changeFunc = (event) => {
            if(event.target.value >= 0)
            {
                setter(event.target.value)
            }
        }
    }
    else
    {
        changeFunc = (event) => {
            setter(event.target.value)
        }
    }

    return(
        <div 
            className = "mealItemInfoSubDiv"
            style = {{
                display : "flex",
                justifyContent : "space-between",
                marginTop: "5px"
            }}
        >
            <p style = {{ margin : "0px" , marginTop : "5px"}} >{name}</p>
            <TextField 
                value = {value} 
                type = {type}
                margin="dense"
                size = "small"
                onChange = {changeFunc}
                
                sx = {{
                    width : "175px",
                    textAlign : "right",
                    margin : "0px"
                }} 
            />        
            </div>
    )
}

const AddFoodItem = (props) => {

    const {handleClose, handleServerErrors} = props

    const [name, setName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [servingUnit, setServingUnit] = useState("g");
    //It would probably be nice to have serving sizes that support fractions
    const [servingSize, setServingSize] = useState(0);
    const [calories, setCalories] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    const [protein, setProtein] = useState(0);

 
    const acceptChange = () => {
        //update based on change
        //currently not detecing errors if the food item is invalid
        addNewFoodItemConnect(name, brandName, servingSize, servingUnit, calories, carbs, fat, protein)
        .then(res => {console.log("NO ERROR")})
        .catch(error => handleServerErrors(error))
        handleClose();
    }



    return(
            <Card className = "addFoodItem" sx ={{border : "solid grey 2px"}}>
                {/*propbaby can use labels or something*/}
                <h2>Add an item to the database</h2>
                <hr></hr>
                <div >
                    <InformationInput name = "Name" value = {name} setter = {setName} type = "text"/>
                    <InformationInput name = "Brand Name" value = {brandName} setter = {setBrandName} type = "text"/>
                    <hr></hr>
                    <ServingSizeAndUnit
                        servingSizeValue = {servingSize}
                        servingUnitValue = {servingUnit}
                        servingSizeSetter = {setServingSize}
                        servingUnitSetter = {setServingUnit}
                    />
                    <InformationInput name = "Calories" value = {calories} setter = {setCalories} type = "number"/>
                    <InformationInput name = "Carbs" value = {carbs} setter = {setCarbs} type = "number"/>
                    <InformationInput name = "Fat" value = {fat} setter = {setFat} type = "number"/>
                    <InformationInput name = "Protein" value = {protein} setter = {setProtein} type = "number"/>
                </div>
                <hr></hr>
                <div className = "addFoodItemButtons">
                    <Button onClick = {handleClose} >Cancel</Button>
                    <Button onClick = {acceptChange} >Accept</Button>
                </div>
            </Card>
        )

}

export default AddFoodItem;


//                     <InformationInput name = "Serving Size" value = {servingSize} setter = {setServingSize} type = "number"/>
//                    <InformationInput name = "Serving Unit" value = {servingUnit} setter = {setServingUnit} type = "text"/>
