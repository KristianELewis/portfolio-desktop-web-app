/*================================================================

TODO

-Change this to "MainPage"

-Add a Meals Component
    -On choosing a day, send data down to the Meals Component

-Add Reactive Functionality
    -350 is the smallest width allowed
        -from 450 to 350 just deccrease space

-Move "Add to Food Database"
    -perhaps on clicking add food "Add to Food Database" should be included in that backdrop



------------------------------------------------------------------

Overall


-server functions
    -all server functions should handle serverside errors
    -if token expires, then server functions should logout with some standard code (think this is done already)
    -login functions all need to be reviewed

-profile picture stuff should be switched to useRef

Eventually -more involved things-

-dark mode/ light mode switch
-error alerts could stack
-potentially add redux

-enter at the login page should just count as login

-login should handle empty username or password better. Currently says inccorect username or password
-update amount accepts "e" as an input, potentially all number inputs do

-changing profile picture should be looked over, its error prone. If you hit cancel while choosing files it will set the files chosen array to nothing
    ,but it does not set the file state to "none" which is used to check if a profile picture has been chosend for update
    if the user changes the profile picture, and then changes the profile pciture again but selects cancel it will cause problems
--------------------------------------------------------------------

-component/filenames ie. this file is named incorrectly, should at least be Day not day
-decide on how stucture imports from material ui

BUTTONS
-remove the uppercase buttons

MEALS

-change column span for add food
    -also change to "Add Food to Meal"
-under daily totals and user info, there should be a block of space dedicated to the day selector
-perhaps user info and daily info should be placed on top of each other 

-should toggle between data for singular meal item and the amount the user has logged
---------------------------------------------------------------------

Style
-buttons need to stand out more
-change amount and delete options need to be changed
-dark mode light mode switch
-css stuff should be condensed, do not need so many files
-deal with left over vite/react css files
-date picker looks a little wonky


MEAL REDUCER
-intial values for meal reducer are here temporarily, these should be removed
-meal states are four separate states to keep the states as flat as possible
    -it is messy and a different state management system should be considered
-loading the daily information does not need to be 3 separate functions
-calculating totals is being done in here and in the Meal.jsx, it is redundant and should be done in one place
-upon loading, there should be loading icons set for each meal
-----------------------------------------------------------------

================================================================*/

import React, {useReducer, useState, useEffect} from "react";

//reducers
import reducer from "../reducers/mealReducer";
import backdropReducer from "../reducers/backdropReducer";

//components
import BackdropBase from "./BackdropBase"
import Meal from "./Meal";

import UpperContainer from './upperContainer/UpperContainer'

import dayjs from 'dayjs';

//material ui
import Alert from '@mui/material/Alert';

//utility functions
import { loadDay } from "../serverFunctions/loggedItemDatabaseServerFunctions";
import {NotFoundError, AuthError, ServerSideError, UnknownError, NoProfilePicture} from '../serverFunctions/customErrors'
import {removeCookies} from '../serverFunctions/cookieUtilFunctions'
import '../stylesheets/day.css'

//initial meal reducer values
const breakfastinit = {name: "Breakfast", loaded : false, meal : 0, mealItems: []}
const lunchinit = {name: "Lunch", loaded : false, meal : 1, mealItems: []}
const dinnerinit = {name: "Dinner", loaded : false, meal : 2, mealItems: []}
const snackinit = {name: "Snack", loaded : false, meal : 3, mealItems: []}
const backdropinit = {open : false, choice : -1};


const Day = (props) => {    
    const { setUserID, setUserData, setIsLoggedIn, setAlerted } = props;


    //used in profileDisplau and edit user
    const [imgURL, setImgURL] = useState(null);

    //server error handling
    // dont like this
    const [errorAlert, setErrorAlert] = useState({error: false, errorType : "none"})

    //if there was an error contacting the server, this will be called
    //not sure if all these errors are necessary at the moment, this may be condensed or changed in the future
    //500 returns are unecessary
    //this should move maybe

    //this can probably be handled diffeernt, its seems very redundant. Instead creating custom errors thee could be an error handler that
    //creates alert objects. This function could instead just set the alert object. If there is an alert, display it, otherwise do nothing
    //having a morere central alert handler/decider (the one in server functions) would be good, and it could work with alert setters in seeparat areas, such as in the login/signp components
    const handleServerErrors = (error) => {
        if (error instanceof AuthError)
        {
            handleLogout()
            //this is for login alerts
            setAlerted({error: true, errorType:"Session expired, please log back in"})
            return
        }
        else if( error instanceof UnauthorizedError)
        {
            setAlerted({error: true, errorType:"Test auth error"})
            return
        }
        else if(error instanceof NotFoundError)
        {
            setErrorAlert({error: true, errorType: error.message})
            return 
        }
        else if(error instanceof NoProfilePicture)
        {
            //This isn't actually an error
            //its probably not a good way of dealing with this
            return
        }
        else if(error instanceof ServerSideError)
        {
            setErrorAlert({error: true, errorType: error.message})
            return
        }
        else if(error instanceof UnknownError)
        {
            setErrorAlert({error: true, errorType: error.message})
            return
        }
        else{
            //this probably should never get reached
            setErrorAlert({error: true, errorType:"There was an issue processing your request 1"})
            return
        }
    }

    //date
    const [curDate, setCurDate] = useState(dayjs());

    //meal states
    const [breakfast, dispatchB] = useReducer(reducer, breakfastinit)
    const [lunch, dispatchL] = useReducer(reducer, lunchinit)
    const [dinner, dispatchD] = useReducer(reducer, dinnerinit)
    const [snack, dispatchS] = useReducer(reducer, snackinit)

    //logout
    const handleLogout = () => {
        setUserID("");
        setUserData({});
        setIsLoggedIn(false);
        removeCookies();
    }

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    /*=======================================================================

    BACKDROP HANDLERS AND STATE

    ========================================================================*/
    
    const [backdropState, dispatchBackdrop] = useReducer(backdropReducer, backdropinit)

    const handleAddFoodItem = () => {
        dispatchBackdrop({type: "ADDDATABASEITEM"})

        //setOpenAdd(true);
    }
    /*------------------------------------------------------------------------
    CHANGE USER DATA BACKDORPS
    ------------------------------------------------------------------------*/
    const handleEditUser = () => {
        dispatchBackdrop({type: "EDITUSER"})
    }
    const handleChangePassword = () => {
        dispatchBackdrop({type: "CHANGEPASSWORD"})
    }

    /*=======================================================================
        LOAD DAILY INFORMATION

        Every time I scroll past this I think about ending it all

        -this needs to change
        -meal states can be placed inside each meal
        -the biggest issue would be getting all 4 meal totals over to the daily totals display
        -could potentially do some props drilling thing
        -send a setter function up to the day.jsx, send this function down into each meal
        -theres too much redundancy with totals, I dont like the static meal states store in the day.jsx(althought I guess this isnt too terrible)
        -I dont like how changing one meal means the entire display is rerendered

        -change this to meal information
        -If I continue to use meals like this, the meal states should be saved in inside the meals themselves.
        -Their totals should also be calculated inside the meals themselves.
        -When a meal changes its totals should be passed up to the day, and then down into a daily totals component
        -right now they will all be rerendered when anyone of them change(the entirety of the day component will be rerendered)
    ========================================================================*/

    function intitializeMeals (list) {

        let bL = []
        let lL = []
        let dL = []
        let sL = []
    
        for (const element of list)
        {
            switch (element.meal){
                case 0:
                    bL.push(element)
                    break;
                case 1:
                    lL.push(element)
                    break;
                case 2:
                    dL.push(element)
                    break;
                case 3:
                    sL.push(element)
                    break;
            }
        }
        dispatchB({type : "LOAD", mealItems : bL})
        dispatchL({type : "LOAD", mealItems : lL})
        dispatchD({type : "LOAD", mealItems : dL})
        dispatchS({type : "LOAD", mealItems : sL})
        return
    }
    const handleLoad = () => {
        //should set the meals to loading icons each time it is called
        loadDay(props.userID,curDate,props.userData.token)
        .then(res => {
            intitializeMeals(res)
        })
        .catch(err => {handleServerErrors(err)})
    }
    useEffect(() => {handleLoad()}, [curDate])

    //This is for calculating the the totals for the chart
    //totals are also being calculated in each meal component, redudant
    //Jesus man
    const totals = {
        calories : 0,
        carbs : 0,
        fat : 0,
        protein : 0
    }    
    breakfast.mealItems.map((mealItem, i) => {
        totals.calories += mealItem.calories * mealItem.amount
        totals.fat += mealItem.fat * mealItem.amount
        totals.carbs += mealItem.carbs * mealItem.amount
        totals.protein += mealItem.protein * mealItem.amount
    })
    lunch.mealItems.map((mealItem, i) => {
        totals.calories += mealItem.calories * mealItem.amount
        totals.fat += mealItem.fat * mealItem.amount
        totals.carbs += mealItem.carbs * mealItem.amount
        totals.protein += mealItem.protein * mealItem.amount
    })
    dinner.mealItems.map((mealItem, i) => {
        totals.calories += mealItem.calories * mealItem.amount
        totals.fat += mealItem.fat * mealItem.amount
        totals.carbs += mealItem.carbs * mealItem.amount
        totals.protein += mealItem.protein * mealItem.amount
    })
    snack.mealItems.map((mealItem, i) => {
        totals.calories += mealItem.calories * mealItem.amount
        totals.fat += mealItem.fat * mealItem.amount
        totals.carbs += mealItem.carbs * mealItem.amount
        totals.protein += mealItem.protein * mealItem.amount
    })

    return (
        <>
            {/* This section could potentially be moved into a single component*/}
            <UpperContainer                 
                userData = {props.userData} 
                imgURL = {imgURL} 
                setImgURL = {setImgURL}
                handleEditUser = {handleEditUser}
                handleLogout = {handleLogout}
                handleAddFoodItem = {handleAddFoodItem}
                handleServerErrors = {handleServerErrors}
                curDate = {curDate} 
                setCurDate = {setCurDate}
                handleChangePassword = {handleChangePassword}
                totals = {totals}
                />         
            {errorAlert.error ? <Alert onClose = {() => {setErrorAlert({error: false, errorType : "none"})}} severity="error">{errorAlert.errorType}</Alert>: <></>}
            <hr></hr>
            <div>
                {breakfast.loaded ? 
                    <Meal 
                        meal = {breakfast}
                        dispatch = {dispatchB} 
                        dispatchBackdrop = {dispatchBackdrop}
                    /> : <p>loading</p>}
                {lunch.loaded ? 
                    <Meal 
                        meal = {lunch} 
                        dispatch = {dispatchL} 
                        dispatchBackdrop = {dispatchBackdrop}
                    /> : <p>loading</p>}
                {dinner.loaded ? 
                    <Meal 
                        meal = {dinner} 
                        dispatch = {dispatchD} 
                        dispatchBackdrop = {dispatchBackdrop}
                    /> : <p>loading</p>}
                {snack.loaded ? 
                    <Meal 
                        meal = {snack} 
                        dispatch = {dispatchS} 
                        dispatchBackdrop = {dispatchBackdrop}
                    /> : <p>loading</p>}
            </div>
            <hr></hr>
            {/*If I decide to keep the backdrop reducer I could probably remove some of these and put them in the dispatch */}
            <BackdropBase 
                backdropState = {backdropState} 
                dispatchBackdrop = {dispatchBackdrop}
                curDate = {curDate}
                userID = {props.userID}
                token = {props.userData.token}
                handleServerErrors = {handleServerErrors}
                userData = {props.userData} 
                setUserData = {props.setUserData} 
                imgURL = {imgURL} 
                setImgURL = {setImgURL}
            />
        </>
    );
}
export default Day;