import React, {useState, useRef, useEffect} from "react";
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";

const LoginScreen = (props) => {

    const {loggedIn, setLoggedIn} = props;

    const [username, setUsername] = useState({uArray : ['u', 's', 'e', 'r', 'n', 'a', 'm', 'e'], username : ""})
    const [password, setPassword] = useState({pArray : ['p', 'a', 's', 's', 'w', 'o', 'r', 'd'], password : ""})
    const [loginCounter, setloginCounter] = useState(0);

    /*
        using shift here messes up the program because of the second rerender I think. So I need to make 
        But theres more than that, I think I need to use a useEffect much like the one in the menu bar
        These rerenders are coming up as regular renders, and theres 6 of them. Without this section renders twice and theres 2 re renders for a total of four

        There's definitely a better way to do this, but this works for now

        I hate this
    */

    useEffect(() => {
        console.log("useEffect")

        const interval = setInterval(() => 
            //setTimeout(() => 
            {  
                console.log("Interval")
                if(username.uArray.length != 0){
                    console.log("The array at start: " + username.uArray)  
                    console.log("The New Username at Start: " + username.username)
                    const letter = username.uArray[0];
                    console.log("the Letter: " + letter)
                    setUsername((prevValue) => {return {uArray : prevValue.uArray.slice(1), username : prevValue.username + letter}})
                }
                else if (password.pArray.length != 0){
                    console.log("The array at start: " + password.pArray)  
                    console.log("The New password at Start: " + password.password)
                    const letter = password.pArray[0];
                    console.log("the Letter: " + letter)
                    setPassword((prevValue) => {return {pArray : prevValue.pArray.slice(1), password : prevValue.password + letter}})
                }
                else if(loginCounter < 10)
                {
                    setloginCounter((prevValue) => prevValue + 1)
                }
            }, 100)
        return () => clearInterval(interval);
    }, [username, password])

    if (loginCounter === 10){
        //this is in a timeout to let the component finishing rendering, it gives errors otherwise
        //this timeout + the setloginCounter interval will make one second in total
        setTimeout(() => setLoggedIn(true), 100);
    }
    //Login screen will need to adjust for different displays
    return (
        <div style = {{height : "100vh", display : "flex", justifyContent: "center", alignItems : "center", userSelect : "none"}}>
            {/* Cant allow users to manipulate the username or login */}
            {/*Easiest solution right now is to just put a transparent div on top of this */}
            <Paper elevation={1} sx = {{width: "500px", height : "300px", boxSizing : "border-box", display : "flex", flexDirection : "column", justifyContent: "center", alignItems : "center"}}>
                <h2>Login</h2>
                <div>
                    <label>Username : </label>
                    <TextField size = "small" value = {username.username}/>
                </div>
                <div style = {{marginTop : "10px"}}>
                    <label>Password : </label>
                    <TextField type = "password" size = "small" value = {password.password} sx = {{}}/>
                </div>
            </Paper>
        </div>
    )
}

export default LoginScreen;