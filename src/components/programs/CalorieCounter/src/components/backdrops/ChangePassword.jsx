import React, {useState} from 'react'

import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert"

import {handleChangePassword} from '../../serverFunctions/userDataServerFunctions.js'

//this has been used in multiple components. This will be turned into its own component soon
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





const ChangePassword = (props) => {

    //seems unecessary to send all of userData
    const {userData, handleClose, handleServerErrors} = props;

    const [originalPassword, setOriginalPassword] = useState("")
    const [firstNewPassword, setFirstNewPassword] = useState("")
    const [secondNewPassword, setSecondNewPassword] = useState("")

    const [alertStatus, setAlertStatus] = useState({isAlerted: false, message : "none"})

    const handleAccept = () => {
        if(secondNewPassword !== firstNewPassword)
        {
            setAlertStatus({isAlerted: true, message : "The new passwords do not match"})
            return
        }
        handleChangePassword(userData, firstNewPassword, originalPassword)
        .then(res => {
            //this should set the days alert to a success message
            //do nothing?
        })
        .catch(error => handleServerErrors(error))
        //catch should set this components alert, not the days alert
        handleClose()
    }

    //this is using the editUser css classes
    return (
            <Card className = "editUser" sx ={{border : "solid grey 2px", width : "325px"}}>
                {/*propbaby can use labels or something*/}
                <h2 style = {{marginTop: "0px"}}>Change Your Password</h2>
                <hr></hr>
                <div className="editUserFields">
                    <InformationInput
                        name = "New Password"
                        value = {firstNewPassword}
                        setter = {setFirstNewPassword}
                        type = "password"
                    />
                    <InformationInput
                        name = "Re-enter Password"
                        value = {secondNewPassword}
                        setter = {setSecondNewPassword}
                        type = "password"
                    />
                </div>
                <hr></hr>
                <div style ={{textAlign: "left", paddingTop : "5px"}}>
                <InformationInput
                        name = "Old Password"
                        value = {originalPassword}
                        setter = {setOriginalPassword}
                        type = "password"
                        
                    />
                </div>
                <p style = {{fontSize: "14px"}}>Re-enter your old password to make changes</p>

                <hr></hr>
                {alertStatus.isAlerted ? <Alert onClose = {() => {setAlertStatus({isAlerted: false, message : "none"})}} severity="error">{alertStatus.message}</Alert> : <></>}
                <div className="editUserButtons">
                    <Button onClick = {handleClose} >Cancel</Button>
                    <Button onClick = {handleAccept} >Accept</Button>
                </div>
            </Card>
    )
}
//                 <Alert onClose = {() => {setErrorAlert({error: false, errorType : "none"})}} severity="error">{errorAlert.errorType}</Alert>
export default ChangePassword