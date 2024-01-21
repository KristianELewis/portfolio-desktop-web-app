import React, {useState} from "react";

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import metaData from "../../metaData";


const InfoPopover = (props) => {
    const {onPointerDown, program} = props


    //======================================================================
    //POPOVER STUFF
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (e)=> {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    //=======================================================================
    //PAGE AND INFO CONTENT
    //I don't want these things redone everytime. Not sure what the right thing to use is. Memo? useRef doesnt seem right
    const [currentPage, setCurrentPage] = useState(1)
    const content = metaData[program].info;
    const pages = content.length;
    const handleBackwardButton = () => {
        setCurrentPage((prevState) => {
            return prevState - 1;
        })
    }
    const handleForwardButton = () => {
        setCurrentPage((prevState) => {
            return prevState + 1;
        })
    }

    //I might want to have the info box resize with the window if the window becomes smaller than 150 px. I think I'm going to change the smallest width to 200px, in that case nothing here will change,
    //but If I decide to keep it to 150px I may want to have transform origin and the typography component to have a dynamic size based on the size of the window.
    //Transform origin is always 49 less than the typography width
    return(
        <>
            <QuestionMarkIcon
                sx = {{
                    display : "inline-block",
                    justifySelf : "end",
                    color : "gray",
                    borderRadius : "50%",
                    marginLeft : "3px",
                    marginRight : "3px",
                    "&:hover": { backgroundColor: "gray", color : "white" }
                }}
                onClick = {handleClick}
                onPointerDown = {onPointerDown}
            />
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 161,
                  }}
                  onPointerDown = {onPointerDown}

                >
                <Typography className = "noUserSelection" sx={{ p: 1, width: "200px", fontSize : "14px", whiteSpace: "pre-wrap" }}>{content[currentPage-1]}</Typography>
                
                {program === 0 ? <a 
                    href="https://kristianlewis.com/caloriecounter" 
                    target = "_blank" 
                    style = {{
                        textAlign : "center",
                        padding : "7px",
                        color : "white",
                        fontSize : "15px",
                        paddingLeft : "32px",
                        "&:visited": { color : "white" }

                    }}>
                        Stand Alone Version
                </a> : <></>}

                {/*This needs to change */}
                {program === 2 && currentPage === pages? <a 
                    href="https://kristianlewis.com/PianoSynthJS" 
                    target = "_blank" 
                    style = {{
                        textAlign : "center",
                        padding : "7px",
                        color : "white",
                        fontSize : "15px",
                        paddingLeft : "32px",
                        "&:visited": { color : "white" }

                    }}>
                        Stand Alone Version
                </a> : <></>}
                <div style = {{width : "200px", display : "flex", justifyContent :"space-between"}}>
                    <IconButton size = "small" onClick = {handleBackwardButton} sx = {{borderRadius : "5px"}} disabled = {currentPage === 1 ? true : false}><ChevronLeftIcon/></IconButton>
                    <Typography className = "noUserSelection" sx={{ p: 1, fontSize : "14px", display : "inline-block" }}>Page {currentPage} of {pages}</Typography>
                    <IconButton size = "small" onClick = {handleForwardButton} sx = {{borderRadius : "5px"}} disabled = {currentPage === pages ? true : false}><ChevronRightIcon/></IconButton>
                </div>
            </Popover>
        </>
    )
}
export default InfoPopover;