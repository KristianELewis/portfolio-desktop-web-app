import React from "react";

import CloseIcon from '@mui/icons-material/Close';

import InfoPopover from './InfoPopover';

const TopBarButtons = (props) => {
    const {handleExit, preventPositioning, program} = props;
    return (
        <div style = {{ textAlign : "right", display : "grid", minWidth : "60px", gridTemplateColumns : "1fr 30px 30px", alignItems : "center"}} >
                {/*This div is purely for formatting purposes. It there is probably a better way to do this. I just need to fill the space on the left of the icons */}
                <div> </div>

                <InfoPopover onPointerDown = {preventPositioning} program = {program}/>
                <CloseIcon 
                    sx = {{
                        display : "inline-block",
                        color : "gray",
                        borderRadius : "50%",
                        marginLeft : "3px",
                        marginRight : "3px",
                        "&:hover": { backgroundColor: "red", color : "white" }
                    }}
                    onClick = {handleExit}
                    onPointerDown = {preventPositioning}
                />
        </div>
    )
}

export default TopBarButtons;