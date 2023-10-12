/*===================================================================================

TODO

OVERALL
-Maybe completely rework this page.

OLD TODO LIST
-I should think about an alternative to the ternary exressions used to decide what is being displayed
-Remove signin and signup, add them to their own pages


LOGIN FUNCTIONALITY
-Both login and signup functionality needs to use the newer error handling
-userLogin_ and userLogin need to have more easily distinguished names
  -userLogin should be renamed to something more akin to userLoginServer, something that signifies that it connects to the server
-both login functions could be moved to a separate file

USERDATA
-userdata should be a useContext and not useState
-userID needs to be removed, it has become redundant

====================================================================================*/

import { useState, useEffect } from 'react'

//need to deal with this css file
import './App.css'

import Day from './components/day';
import LoginPage from './components/LoginPage';
import InfoPage from './components/InfoPage';

//needed for materui themes and styling
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

//server and cookie functions
import { userLogin, tokenLoginS } from './serverFunctions/serverFunctions';
import {getCookies, setCookies, removeCookies} from './serverFunctions/cookieUtilFunctions'

import { widthContext } from './Contexts.js'

//needed for dark theme
//themes might be able to do stuff with mediaQueries
const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });



/*================================================================================
LOGIN FUNCTOINS
================================================================================*/
async function userLogin_ (username, password, setAlerted) {
    return userLogin(username, password)
    .then (res => {
        if (res.userID === "notFound"){
            setAlerted({error: true, errorType:"Incorrect username or password"});
            return {
                userID: "",
                loggedIn: false
            }
        }
        else{
            setAlerted({error: false, errorType:"none"})
            setCookies(res.token, res.userID)
            return {
                userID: res.userID, 
                loggedIn : true, 
                userData : res
            }
        }
    })
}

async function tokenLogin (username, token, setAlerted) {
    return tokenLoginS(username, token)
    .then (res => {
        if (res.userID === "notFound"){
            setAlerted({error: true, errorType:"Incorrect username or password"});
            return {userID: "", loggedIn: false}
        }
        else{
            //error prone
            setAlerted({error: false, errorType:"none"})
            return {
            userID: res.userID, 
            loggedIn : true, 
            userData : {...res, token}};
      }
  })
}

const App = (props) => {

    const { media700W, media600W, media500W } = props;

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    //userID needs to be deleted it is redundant
    const [userID, setUserID] = useState("");

    const [userData, setUserData] = useState({});

    //used to display an alert if username/password are incorrect
    const [alerted, setAlerted] = useState({error: false, errorType:"none"});

    const [infoPage, setInfoPage] = useState(true);


    const handleInfoPage = () => {
        setInfoPage(false);
    }

    useEffect(() => {
        //if there is a token in the cookies try logging in
        //Not happy with this try catch
        try{
            const cookieResults = getCookies()
            tokenLogin(cookieResults.userID, cookieResults.token, setAlerted)
            .then(result => {
                setIsLoggedIn(result.loggedIn)
                setUserID(result.userID)
                setUserData(result.userData)
            })
            .catch(error => {})
        }
        catch{
            
        }
    }, [])

    async function handleLoginStatus (username, password) {
        let result = await userLogin_(username, password, setAlerted)
        setIsLoggedIn(result.loggedIn)
        setUserID(result.userID)
        setUserData(result.userData)
    }


    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <widthContext.Provider value = {{media700W : media700W, media600W : media600W, media500W : media500W}}>
                {infoPage ? 
                <InfoPage
                    handleInfoPage= {handleInfoPage}
                />
                :
                    (!isLoggedIn ? 
                    (<LoginPage 
                        userLogin_ = {handleLoginStatus} 
                        alerted = {alerted} 
                        setAlerted = {setAlerted}
                    />) 
                    : 
                    <div className='main-container'>
                        <Day 
                            userID={userID}
                            userData = {userData} 
                            setUserData = {setUserData} 
                            setUserID = {setUserID}
                            setIsLoggedIn = {setIsLoggedIn}
                            setAlerted = {setAlerted}
                        />
                    </div>)
                }
            </widthContext.Provider>
        </ThemeProvider>
    )
}
export default App
// 
//
// 
