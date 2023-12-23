
//const hostURL = "http://localhost:3000"
const hostURL = "https://kristianlewis.com/caloriecounter"

import {serverErrorDecider} from './customErrors'

/*------------------------------------------------------------------------------------
LOGIN

used in App.jsx

Eventually will switch to sessions for login and jwt with a short lifespan for crud. Not super important right now though
------------------------------------------------------------------------------------*/
export async function userLogin (username, password) {

	return (
		fetch(hostURL + "/login", {
		method: "POST",
		body: JSON.stringify({
			username: username,
			password: password 
		}),
			headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
        })
        //.then((res => res.json()))
        .then(res =>{             
            if(!res.ok){
                return serverErrorDecider(res)
            }
            return res.json()
        })
	)
}

export async function tokenLoginS (userID, token) {
    return (
		fetch(hostURL + `/login/token/${userID}`, {
		method: "POST",
			headers: {
			"Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token
		}
        })
        //.then((res => res.json()))
        .then(res =>{             
            if(!res.ok){
                return serverErrorDecider(res)
            }
            return res.json()
        })
	)
}

/*------------------------------------------------------------------------------------
USER SIGNUP
no auth needed
used in SignUpPage.jsx
------------------------------------------------------------------------------------*/

export async function signUp (userData) {
    return (
        fetch(hostURL + "/login/signup", {
        method: "POST",
        body: JSON.stringify({
            userData : userData
        }
        ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        })
        //.then(res => res.json()))
        .then(res =>{             
            if(!res.ok){
                return serverErrorDecider(res)
            }
            return res.json()
        })
    )
}

