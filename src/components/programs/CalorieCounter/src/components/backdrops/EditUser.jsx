/*========================================================

TODO

-file state should be useRef
-currently does not reset picture state
    -picture choosing/uploading is error prone a the moment
-add abilty to change password

-age and weight are not important at the moment

-neeed to add the ability to delete profile picture
========================================================*/

import React, {useState} from "react";


//Material UI
import Backdrop from '@mui/material/Backdrop';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import Checkbox from '@mui/material/Checkbox';

import "../../stylesheets/editUser.css"

import {handleUpdateUserInfo, uploadNewProfilePicture, deleteProfilePicture} from '../../serverFunctions/userDataServerFunctions.js'


//this is copy pasted from add meal item

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

const EditUser = (props) => {
    const {handleClose, userData, setUserData, imgURL, setImgURL, handleServerErrors} = props;

    const [nameChange, setNameChange] = useState(userData.name);
    const [usernameChange, setUsernameChange] = useState(userData.username);
    const [passwordChange, setPasswordChange] = useState("");
    const [deleteChecked, setDeleteChecked] = useState(false)
    //should this be a useRef?
    const [file, setFile] = useState("none");
    const [fileSet, setFileSet] = useState(false)

    //This is probably a terrible way to check if the file is an image or not. Oh well! Maybe I will fix it later.
    async function verifyImage() {
        return new Promise((resolve) => 
        {
            let image = new Image();
            image.onload = function() {
                resolve( {valid : true, url : image.src})
            }
            image.onerror = function() {
                resolve({valid : false, url : null})
            }
            image.src = URL.createObjectURL(file)
        })
    }
    const fileChange = (event) => {
        setFile(event.target.files[0]);
        setFileSet(true);
    }
    const handleChecked = (e) =>{
        setDeleteChecked(e.target.checked)
        //console.log(e.target.checked)
    }
    /*
        if there was an issue uploading both user data an profile picture, the user will only be informed about one of them, most likely profile picture
        this is a low priority issue
    */
    const acceptChange = () => {
        /*
        eventually I want to put this here, but I also want to have alerts on the edit user backdrop before I do that
        if(passwordChange === "")
        {
            //the password was not entered. needs to throw an error or something. Just prevents unecessary server calls
            return
        }
        */
        if(userData.username !== usernameChange || userData.name !== nameChange)
        {
            const newUserData = {...userData, username: usernameChange, name : nameChange}
            handleUpdateUserInfo(newUserData, passwordChange)
            .then(res => {
                setUserData(newUserData)
            })
            .catch(error => handleServerErrors(error))
        }
        
        /*
            if the file changed user wants to upload a new profile picture
            make sure its valid
            nothing will be relayed to the user if its invalid, they would have needed to meddle with the source to upload a non image

            I'm sure there is a better way to validate if it is an image, I'll look into it later though, its not super important now 
        */
        if(fileSet && !deleteChecked)
        {
            verifyImage()
            .then(res => {
                if(res.valid){
                    uploadNewProfilePicture(userData.userID, file, passwordChange)
                    .then(res => {
                        if(imgURL){
                            //console.log("removing old imageURL")
                            //this would be if there is an image in the first place
                            URL.revokeObjectURL(imgURL)
                        }
                        setImgURL(URL.createObjectURL(file))
                    })
                    .catch(error => {
                        handleServerErrors(error)
                    })
                }
                //why is this returning res
                return res    
            })
        }
        if(deleteChecked && imgURL) //if theres no image, theres no reason to do this
        {
            deleteProfilePicture(userData.userID, passwordChange)
            .then(res => {
                URL.revokeObjectURL(imgURL)
                setImgURL(null)
            })
            .catch(error => {
                handleServerErrors(error)
            })
        }
        handleClose();
    }
    return (
            <Card className = "editUser" sx ={{border : "solid grey 2px", width : "325px"}}>
                {/*propbaby can use labels or something*/}
                <h2 style = {{marginTop: "0px"}}>Edit Your Information</h2>
                <hr></hr>
                {/*is it really necessary to have flexbox column for this section?
                    this is potentially something to look into
                */}
                <div className="editUserFields">
                    <InformationInput
                        name = "Username"
                        value = {usernameChange}
                        setter = {setUsernameChange}
                        type = "text"
                    />
                    <InformationInput
                        name = "Name"
                        value = {nameChange}
                        setter = {setNameChange}
                        type = "text"
                    />
                    <div style = {{display: "flex", justifyContent: "space-between", alignItems : "center", marginTop : "5px"}}>
                        <label>Profile Picture</label>
                        <Button
                            variant="contained"
                            component="label"
                            size = "small"
                            disabled = {deleteChecked}
                            >
                            {fileSet ? file.name : "Upload File"}
                            <input
                                type="file"
                                onChange = {fileChange}
                                hidden
                            />
                        </Button>
                    </div>
                    {/* this div exists because flexbox will break the checkbox in column display 
                        but also its necessary because to have label you need formcontrols, and I don't feel like figuring that out right now, something to do later maybe
                        should consider looking into using forms, I think its good practice to use forms and labels for inputs instead of <p> tags, atleast in terms of good html structure
                        the style is stolen from above
                    */}
                    <div style = {{display: "flex", justifyContent: "space-between", alignItems : "center", marginTop : "5px"}}>
                        <label>Delete Profile Picture</label>
                        <Checkbox color = "error" checked = {deleteChecked} disabled = {!imgURL} onChange={handleChecked}/>
                    </div>
                </div>
                <hr></hr>
                <InformationInput
                        name = "Password"
                        value = {passwordChange}
                        setter = {setPasswordChange}
                        type = "password"
                    />
                <p style = {{fontSize: "14px"}}>Re-enter your password to make changes</p>

                <hr></hr>
                <div className="editUserButtons">
                    <Button onClick = {handleClose} >Cancel</Button>
                    <Button onClick = {acceptChange} >Accept</Button>
                </div>
            </Card>
    )
}

export default EditUser;


/*

NOT IN USE ANYMORE?

const handleNameChange = (event) => {
    const newName = event.target.value;
    setNameChange(newName);
}


OLD WEIGHT AND AGE STUFF


I'm not uing age and weight at the moment, maybe later on I will.

const [ageChange, setAgeChange] = useState(userData.age);
const [weightChange, setWeightChange] = useState(userData.weight);

const handleAgeChange = (event) => {
    const newAge = parseInt(event.target.value);
    setAgeChange(newAge);
}

const handleWeightChange = (event) => {
    const newWeight = parseInt(event.target.value);
    setWeightChange(newWeight);
}

//rreturn statment stuff

<TextField 
    value = {ageChange} 
    onChange = {handleAgeChange} 
    type = "number" 
    label = "Age"
    InputProps={{
        className: "editUserFieldsTextfield",
    }}
/>
<TextField 
    value = {weightChange} 
    onChange = {handleWeightChange} 
    type = "number" 
    label = "Weight"
    InputProps={{
        className: "editUserFieldsTextfield",
    }}
/>


*/