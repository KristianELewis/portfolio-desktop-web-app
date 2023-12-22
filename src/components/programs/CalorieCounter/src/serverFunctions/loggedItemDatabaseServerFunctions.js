/*
LOCATIONS
~~~~~~~~~~~~~~~~~~~~~
Day.jsx -errors done
BackdropBase.jsx -errors done, maybe move dispatch
AddFoodItem.jsx -errors done
EditUser.jsx -error handling in use old
ProfileDisplay.jsx -errors done
SearchItemForm.jsx -errors done
SearchResults.jsx -errors done
App.jsx -has its own form of error handling old
SignUpPage.jsx -has its own form of error handling old
~~~~~~~~~~~~~~~~~~~~~~
Needs to completelty be redone for errors, just use responses

TODO

-these can be placed in separate files
-this file should probably just change to a js file

-needs to be https
-needs to reject http

-need to deal with remenants of old error handling
    -some things will still return a res.json() that used to hold the old error handling information

-userSignup and login are still using their own error handling
    -probably should modify to use the more generic error handling
______________________________________________________________________________________*/

import dayjs from 'dayjs';
//const hostURL = "http://localhost:3000"
const hostURL = "https://kristianlewis.com/caloriecounter"
import {serverErrorDecider} from './customErrors'
/*====================================================================================

LOGGED ITEM FUNCTIONS

/*------------------------------------------------------------------------------------
DELETE LOGGED ITEM
used in BackdropBase.jsx
------------------------------------------------------------------------------------*/
export async function handleDelete (loggedID, userID, token, dispatch){
    
    const path = hostURL + `/user/${userID}/logged-food/${loggedID}`

    return fetch(path, {
        method: "DELETE",
        body: JSON.stringify({
            loggedID : loggedID,
            userID : userID,
        }
        ),
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token
        }
    })
    .then(res => {
        //will either return the data or an error
        if(!res.ok){
            return serverErrorDecider(res)
        }
        dispatch({type : "REMOVEITEM", loggedID : loggedID})
    })
}

/*------------------------------------------------------------------------------------
UPDATE LOGGED ITEM AMOUNT
function name should change
used in BackdropBase.jsx
------------------------------------------------------------------------------------*/

export async function handleUpdate (loggedID, amount, userID, token, dispatch) {

    const path = hostURL + `/user/${userID}/logged-food/${loggedID}`

    return fetch(path, {
        method: "PATCH",
        body: JSON.stringify({
            amount : amount
        }
        ),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token
        }
        })
        .then(res => {
            //will either return the data or an error
            if(!res.ok){
                return serverErrorDecider(res)
            }
            dispatch({type : "CHANGEAMOUNT", loggedID : loggedID, amount : amount})
    })
}

/*------------------------------------------------------------------------------------
ADD LOGGED ITEM 
auth needed
used in SearchItemForm.jsx
------------------------------------------------------------------------------------*/
export async function addMealItemServerFunc (userID, meal, foodItemID, amount, curDate, token) {
    
    const date = dayjs(curDate).format('YYYY-MM-DD')
    const path = hostURL + `/user/${userID}/date/${date}/new-item`

	return (
		fetch(path, {
		method: "POST",
		body: JSON.stringify({
			meal: meal, 
			foodItemID : foodItemID, 
			amount : amount
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token
		}
		})
        .then(res => {
            //will either return the data or an error
            if(!res.ok){
                return serverErrorDecider(res)
            }
            return res.json()
        })
	)
}

/*------------------------------------------------------------------------------------
LOAD DAY
load meal information for a specific day
auth needed
used in Day.jsx
------------------------------------------------------------------------------------*/

export async function loadDay (userID, curDate, token) {
   
    const date = dayjs(curDate).format('YYYY-MM-DD')
    const path = hostURL + `/user/${userID}/date/${date}`
  
    return (
        fetch(path, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": "Bearer " + token
            }
        })
        .then(res => {
            //will either return the data or an error
            if(!res.ok){
                return serverErrorDecider(res)
            }
            return res.json()
        })
    )
  }