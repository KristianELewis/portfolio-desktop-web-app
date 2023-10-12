/*======================================================================

    TODO

    -signup needs to work on enter
    -needs more validation
        -nothing can contain spaces, it will break the program, especially with userID/username

======================================================================*/

import React, {useState} from "react";

//Material UI
import Card from '@mui/material/Card';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';


import { signUp } from "../serverFunctions/serverFunctions";

import '../stylesheets/signup.css'


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

const SignupPage = (props) => {

        const [signupError, setSignupError] = useState({isError : false, errorType : "none"})
        const {setSignup} = props;

        const [signupComplete, setSignupComplete] = useState(false);

        const [username, setUsername] = useState("")
        const [password, setPassword] = useState("")
        const [name, setName] = useState("");

        const handleCancel = () => {
            setSignup(false);
        }

        //checks if there is white space
        //  /\s/ is regular expression for white space
        function hasWhiteSpace(str) {
            return /\s/.test(str);
        }

        //not sure if there is a better way to user input vallidation
        //there is also serverside validation
        const userValidation = () => {
            if (username === "" || hasWhiteSpace(username)){
                setSignupError({isError : true, errorType : "Invalid Username"})
                return true;
            }
            else if(password === "" || hasWhiteSpace(password)){
                setSignupError({isError : true, errorType : "Invalid Password"})
                return true;
            }
            else if(name === ""){
                setSignupError({isError : true, errorType : "No Name Sent"})
                return true;
            }
            return false;
        }

        //if anything is not entered it should just fail
        const handleSignUp = () => {
            setSignupError({isError : false, errorType : "none"})
            if (userValidation() === true ) {
                return
            }
            const userData = {
                username: username,
                password: password,
                name: name
            }
            signUp(userData)
            .then(res => {
                if (res.error === true)
                {
                    setSignupError({isError : true, errorType : res.errorType})
                }
                else{
                    setSignupError({isError : false, errorType : "none"})
                    setSignupComplete(true);
                    //eventually this should just sign you in
                    setTimeout(() => setSignup(false), 1000)
                }
            })

        }
    return(
        <Card className = "signupPage" sx ={{border : "solid grey 2px"}}>
            <h3>Calorie Counter</h3>
            <hr></hr>
            <h3>Signup</h3>
            <div className = "signupInputs">
                <InformationInput
                    name = "Username"
                    value = {username}
                    setter = {setUsername}
                    type = "text"
                />
                <InformationInput
                    name = "Name"
                    value = {name}
                    setter = {setName}
                    type = "text"
                />      
                <InformationInput
                    name = "Password"
                    value = {password}
                    setter = {setPassword}
                    type = "password"
                />   
            </div>
            <hr></hr>
            {signupError.isError ? <Alert onClose = {() => {setSignupError({isError : false, errorType : "none"})}} severity="error">{signupError.errorType}</Alert> : <></>}
            {signupComplete ? <Alert severity="success">Signup Successful</Alert> : 
            <div className="signupButtons">
                <Button onClick = {handleCancel}>Cancel</Button>
                <Button onClick = {handleSignUp}>Sign Up</Button>
            </div>}
        </Card>
    )
}

export default SignupPage;


//                <TextField onChange = {handlePasswordChange} required id = "password" type="password" label="Password" size="small" sx = {{marginTop:2}}/>




/*
old input fields

<TextField 
                    onChange = {handleUsernameChange} 
                    required = {true}
                    id = "signupUsername" 
                    label="Username" 
                    size="small" 
                    margin = "normal"
                />
                <TextField 
                    onChange = {handlePasswordChange} 
                    required = {true}
                    id = "signupPassword" 
                    type="password" 
                    label="Password" 
                    size="small" 
                    margin = "normal"
                />
                <TextField 
                    onChange = {handleNameChange} 
                    required = {true}
                    id = "signupName" 
                    type="name" 
                    label="name" 
                    size="small" 
                    margin = "normal"
                />
                <TextField 
                    onChange = {handleAgeChange} 
                    required = {true}
                    id = "signupAge" 
                    type="age" 
                    label="age" 
                    size="small" 
                    margin = "normal"
                />
                <TextField 
                    onChange = {handleWeightChange} 
                    required ={true}
                    id = "signupWeight" 
                    type="weight" 
                    label="weight" 
                    size="small" 
                    margin = "normal"
                />
                */

                            //will not be using these anytime soon. may end up deleting
            /*
            else if(age < 1 || isNaN(age)){
                setSignupError({isError : true, errorType : "Invalid Age"})
                return true;
            }
            else if(weight < 1 || isNaN(weight)){
                setSignupError({isError : true, errorType : "Invalid Weight"})
                return true;
            }*/