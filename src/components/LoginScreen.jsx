import React, {useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import { Avatar } from "@mui/material";
const LoginScreen = (props) => {

    const {loggedIn, setLoggedIn, screenHeight, screenWidth} = props;

    //const [username, setUsername] = useState({uArray : ['u', 's', 'e', 'r', 'n', 'a', 'm', 'e'], username : ""})
    const [password, setPassword] = useState({pArray : ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'], password : ""})
    const [loginCounter, setloginCounter] = useState(0);

    /*
        using shift here messes up the program because of the second rerender I think. So I need to make 
        But theres more than that, I think I need to use a useEffect much like the one in the menu bar
        These rerenders are coming up as regular renders, and theres 6 of them. Without this section renders twice and theres 2 re renders for a total of four

        There's definitely a better way to do this, but this works for now

        I hate this
    */

    useEffect(() => {
        //console.log("useEffect")

        const interval = setInterval(() => 
            //setTimeout(() => 
            {  
                // //console.log("Interval")
                // if(username.uArray.length != 0){
                //     //console.log("The array at start: " + username.uArray)  
                //     //console.log("The New Username at Start: " + username.username)
                //     const letter = username.uArray[0];
                //     //console.log("the Letter: " + letter)
                //     setUsername((prevValue) => {return {uArray : prevValue.uArray.slice(1), username : prevValue.username + letter}})
                // }
                // else 
                if (password.pArray.length != 0){
                    //console.log("The array at start: " + password.pArray)  
                    //console.log("The New password at Start: " + password.password)
                    const letter = password.pArray[0];
                    //console.log("the Letter: " + letter)
                    setPassword((prevValue) => {return {pArray : prevValue.pArray.slice(1), password : prevValue.password + letter}})
                }
                else if(loginCounter < 10)
                {
                    setloginCounter((prevValue) => prevValue + 1)
                }
            }, 100)
        return () => clearInterval(interval);
    }, [/*username,*/ password])

    if (loginCounter === 10){
        //this is in a timeout to let the component finishing rendering, it gives errors otherwise
        //this timeout + the setloginCounter interval will make one second in total
        setTimeout(() => setLoggedIn(true), 100);
    }
    //Login screen will need to adjust for different displays
    //maybe the background image should be dealt with differently
    return (
        <>
        <div className = "blurredBackground"
            style = {{
                backgroundImage : "url(darkOcean.png)", 
                width : "100%", 
                height: "100%", 
                position: "absolute", 
                left : "0", 
                top : "0"
            }}/>
        <div 
            style = {{
                position: "absolute", 
                width : "100%",
                left : "0", 
                top : "0",
                height : "100%", 
                display : "flex", 
                justifyContent: "center", 
                alignItems : "center", 
                userSelect : "none",
                backgroundColor: "rgba(0,0,0, 0.25)"
                }}>
            {/* Cant allow users to manipulate the username or login */}
            {/*Easiest solution right now is to just put a transparent div on top of this */}
            <div 
                style = {{
                    width: "300px",
                    height : "600px",
                    boxSizing : "border-box", 
                    display : "flex", 
                    flexDirection : "column", 
                    justifyContent: "center", 
                    alignItems : "center"
                    }}>
                <Avatar sx = {{bgcolor : "green", width : "150px", height : "150px", fontSize : "75px", border : "solid darkGreen 2px", boxSizing : "border-box"}}>K</Avatar>
                <h2>Kristian</h2>
                <TextField label = "Password" size = "small" value = {password.password} sx = {{backgroundColor: "rgba(0,0,0, 0.25)", width : "235px"}}/>
            </div>
            <div style = {{width: "300px", height : "300px", backgroundColor : "transparent", position : "absolute"}}></div>
        </div>
        </>
    )
}

export default LoginScreen;