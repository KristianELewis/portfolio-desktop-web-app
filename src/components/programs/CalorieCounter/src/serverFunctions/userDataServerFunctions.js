//const hostURL = "http://localhost:3000"
const hostURL = "https://kristianlewis.com/caloriecounter"

import {serverErrorDecider} from './customErrors'

/*====================================================================================
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*====================================================================================

USERDATA FUNCTIONS

/*------------------------------------------------------------------------------------
GET PROFILE PICTURE
used in ProfileDisplay.jsx
------------------------------------------------------------------------------------*/

export async function getProfilePicture(userID){
    //unecessary use of userID.profilePicture
    //also limits the ability for this to be a generic function for getting user profile pictures
    //needs to be removed, just check if the user has uploaded a profile picture
    return fetch(hostURL + `/user/${userID}/profile-picture/`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
    }
    })
    .then(res => {
        //will either return the data or an error
        if(!res.ok){
            return serverErrorDecider(res)

        }
        return res.blob()
    })
}

/*------------------------------------------------------------------------------------
UPDATE USER DATA
used in EditUser.jsx
------------------------------------------------------------------------------------*/
export async function handleUpdateUserInfo (userData, password) {

    return fetch(hostURL + `/user/${userData.userID}/user-info`, {
        method: "PATCH",
        body: JSON.stringify({
            userData : userData,
            password: password
        }
        ),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": password
        }
    })
    .then(res =>{             
        if(!res.ok){
            return serverErrorDecider(res)
        }
        return res.json()
    })
}

/*------------------------------------------------------------------------------------
CHANGE PASSWORD
used in ChangePassword.jsx
------------------------------------------------------------------------------------*/
export async function handleChangePassword (userData, password, oldPassword) {
 
    return fetch(hostURL + `/user/${userData.userID}/user-info/password`, {
        method: "PATCH",
        body: JSON.stringify({
            password: password
        }
        ),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": oldPassword
        }
    })
    .then(res =>{             
        if(!res.ok){
            return serverErrorDecider(res)
        }
        return res.json()
    })
}
/*------------------------------------------------------------------------------------
UPLOAD NEW PROFILE PICTURE
used in EditUser.jsx
------------------------------------------------------------------------------------*/
export async function uploadNewProfilePicture (userID, file, password) {
    let formData = new FormData();
    formData.append('file', file)
    formData.append('password', password)
    return fetch(hostURL + `/user/${userID}/profile-picture`, {
        method: "PATCH",
        body : formData,
        headers: {
            "Authorization": password
      }
    })
    .then(res =>{             
        if(!res.ok){
            return serverErrorDecider(res)
        }
        return res.json()
    })
}

/*------------------------------------------------------------------------------------
DELETE PROFILE PICTURE
used in EditUser.jsx
------------------------------------------------------------------------------------*/
export async function deleteProfilePicture (userID, password) {

    return fetch(hostURL + `/user/${userID}/profile-picture`, {
        method: "DELETE",
        headers: {
            "Authorization": password
      }
    })
    .then(res =>{             
        if(!res.ok){
            return serverErrorDecider(res)
        }
        return res.json()
    })
}
/*====================================================================================*/