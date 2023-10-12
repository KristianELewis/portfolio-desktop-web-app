import React from "react"

import Card from "@mui/material/Card"
import Button from "@mui/material/Button"

import "../stylesheets/infoPage.css"
const InfoPage = (props) => {

/*
    make this more sucinct
    add cookie verify stuff
        if they so no push them back to google or something


*/

    return (
        //cards cant be styled with borders on regular css files
        <Card className ={"infoPage"} sx ={{border : "solid grey 2px"}}>
            <h2>Welcome!</h2>
            <p>This website is under development. If you make an account, it's likely to be deleted without warning!</p>
            <p>This webste uses cookies to remember login info. By using this website you accept the use and storage of these cookies on your device</p>
            <Button onClick = {props.handleInfoPage}>Okay</Button>
        </Card>

    )
}


export default InfoPage