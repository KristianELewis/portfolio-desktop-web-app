/*
    TODO

    -login needs to work on enter
    -need error checking and to do nothing, if nothing is entered
    -decide If Card is really the right component to use here

*/


import React, {useState, useRef} from "react";

//material UI
import Card from '@mui/material/Card';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';

//components
import SignupPage from './SignupPage';

import '../stylesheets/loginPage.css'
const LoginPage = (props) => {

        const inputRef = useRef(null);

        const { alerted , setAlerted} = props;

        const [signup, setSignup] = useState(false);

        const [username, setUsername] = useState("")
        const [password, setPassword] = useState("")

        const handleUsernameChange = (event) => {
            setUsername(event.target.value)
        }
        const handlePasswordChange = (event) => {
            setPassword(event.target.value)
        }
        const handleLogin = () => {
            setAlerted({error: false, errorType:"none"});
            props.userLogin_(username, password)
        }

        const handleSignup = () => {
            setAlerted({error: false, errorType:"none"});
            setSignup(true);
        }
        
        const handleEnterNext = (e) => {
            if(e.key === "Enter"){
                inputRef.current.focus()
            }
        }

        const handleEnterSubmit = (e) => {
            if(e.key === "Enter"){
                handleLogin()
            }
        }

    return(
        <>
            {signup ?
                <SignupPage setSignup = {setSignup}/>
                :
                <Card className = "loginPage" sx = {{border : "solid grey 2px"}}>
                    <h3>Calorie Counter</h3>
                    <hr></hr>
                    <h3>Login</h3>
                    <div className = "loginInputs">            
                        <TextField onChange = {handleUsernameChange} required id = "username" label = "Username" size = "small" onKeyUp = {handleEnterNext}/>
                        <TextField onChange = {handlePasswordChange} required id = "password" type = "password" label = "Password" size = "small" sx = {{marginTop:2}} inputRef={inputRef} onKeyUp = {handleEnterSubmit}/>
                    </div>
                    <hr></hr>
                    {alerted.error ? <Alert onClose = {() => {setAlerted({error: false, errorType:"none"})}}severity="error">{alerted.errorType}</Alert> : <></>}
                    <div className="loginButtons">
                        <Button onClick = {handleSignup}>Sign Up</Button>
                        <Button onClick = {handleLogin}>Login</Button>
                    </div>
                </Card>
            }
        </>
    )
}

export default LoginPage;