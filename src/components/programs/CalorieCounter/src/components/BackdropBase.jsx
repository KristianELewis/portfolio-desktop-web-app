/*========================================================

TODO


-This should be renamed to BackDropController.jsx
-This needs to be completely refactored
-the backdrop reducer is potentially unecessary
-adding food item needs to be in its own route

========================================================*/

import React, {useState} from "react";
import {handleUpdate, handleDelete} from '../serverFunctions/loggedItemDatabaseServerFunctions.js'

//custom components
import SearchItemForm from "./backdrops/SearchItemForm";
import AddFoodItem from "./backdrops/AddFoodItem"
import EditUser from "./backdrops/EditUser"


//material UI
import Backdrop from '@mui/material/Backdrop';
import MealItemInfo from "./backdrops/MealItemInfo.jsx";
import ChangePassword from "./backdrops/ChangePassword.jsx";


const BackdropBase = (props) => {
    const {backdropState, handleServerErrors} = props;

    //we can use a generic close
    const handleClose = () => {
        props.dispatchBackdrop({type : "CLOSEBACKDROP"});
    }

    //These two can be put into their respective dropback components
    //update logged Item
    const acceptChange = (amount) => {
        handleUpdate(backdropState.loggedID, amount, props.userID, props.token, backdropState.dispatch)
        .catch(error => handleServerErrors(error))
        handleClose();
    }
    //deletes logged item
    const acceptChangeDelete = () => {
        handleDelete(backdropState.loggedID, props.userID, props.token, backdropState.dispatch)
        .catch(error => handleServerErrors(error))
        handleClose();
    }

    //this is to fix the issue with backdrops loading in endless css files
    const backdropInternalDecider = () => {
        if (backdropState.choice === 0){
            return (
                <EditUser 
                    handleClose = {handleClose} 
                    userData = {props.userData} 
                    setUserData = {props.setUserData} 
                    imgURL = {props.imgURL} 
                    setImgURL ={props.setImgURL}
                    token = {props.userData.token}
                    handleServerErrors = {handleServerErrors}
                    />
            )
        }
        else if (backdropState.choice === 1){
            return (
                <AddFoodItem 
                    handleServerErrors = {handleServerErrors}
                    handleClose = {handleClose}
                />
            )
        }
        else if (backdropState.choice === 2){
            //backdrop should just be inside the thing
            return(
                <SearchItemForm 
                    userID = {props.userID} 
                    meal = {backdropState.meal} 
                    mealDispatch = {backdropState.dispatch} 
                    curDate = {props.curDate}
                    deny = {handleClose}
                    token = {props.token}
                    handleServerErrors = {handleServerErrors}
                    />
            )
        }
        else if(backdropState.choice === 3){
            return( 
                <MealItemInfo
                    mealItem = {backdropState.mealItem}
                    acceptChange = {acceptChange}
                    acceptChangeDelete = {acceptChangeDelete}
                    deny = {handleClose}        
                />
            )
        }
        else if(backdropState.choice === 4){
            return( 
                <ChangePassword
                    handleClose = {handleClose}
                    userData = {props.userData}
                    handleServerErrors = {handleServerErrors}
                />
            )
        }
        //When I remove the reduce, it should just check for a choice -1 should be the default choice and just have and else statement after the other choices that just returns nothing
        else if (backdropState.choice === -1){
            //feel like I should just not have this here at all
            return(
                <>
                    {/*<Backdrop open = {backdropState.open}>
                    </Backdrop>*/}
                </>
            )
        }
        else{
            //need to throw an error here/fail gracefully
            return (<h1>There is some issue with the backdrop</h1>)
        }
    }

    return (
        <Backdrop open = {backdropState.open} style = {{position : "absolute"}}>
            {backdropInternalDecider()}
        </Backdrop>
    )
}

export default BackdropBase;