/*
TODO

should make cookies more secure
-secure
-httponly

Need to change the expiration to something longer
    -also need to change the expiration for the jwt on the server side
*/

//not sure if all of this cookie validation is really necessary
export const getCookies = () => {
    //if there are cookies, return them, otherwise throw an error
    if(document.cookie){
        const cookies = document.cookie.split(";").map(cookie_ => cookie_.trim(" "))
        if(cookies.length != 2){
            //there should be exactly two cookies
            throw new Error("incorrect cookie amount")
        }
        //again not sure if this is necessary
        //order is aparently not guaranteed
        //even if the validation is necessary, this could probably be done better
        //don't need so many variables, but this is easy to write and I dont think its worth spending too much time on
        const cookie1 = cookies[0].split("=")
        const cookie2 = cookies[1].split("=")
        const cookiesNames = [cookie1[0], cookie2[0]]
        const cookiesValues = [cookie1[1], cookie2[1]]

        const tokenIndex = cookiesNames.indexOf("token")
        const userIndex = cookiesNames.indexOf("userID")

        if(tokenIndex === -1 || userIndex === -1){
            throw new Error("Incorrectly formed cookies")
        }
        return({token : cookiesValues[tokenIndex], userID : cookiesValues[userIndex]})
    }
    else{
        throw new Error("No Cookies")
    }
}

//userID may switch to user name
export const setCookies = (token, userID) => {
    let tokenCookie = `token=${token}; max-age=86400`
    let userIDCookie = `userID=${userID}; max-age=86400`

    document.cookie = tokenCookie
    document.cookie = userIDCookie
}

export const removeCookies = () => {
    document.cookie = "token=0; max-age=0"
    document.cookie = "userID=0; max-age=0"
}