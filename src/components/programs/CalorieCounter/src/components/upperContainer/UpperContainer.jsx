import React, {useContext, lazy, Suspense} from "react";

import ProfileDisplay from './ProfileDisplay'
import TotalsTable from './TotalsTable';
import ChartContainer from './ChartContainer';
import UserControlButtons from './UserControlButtons'

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

import { widthContext } from '../../Contexts.js'

const BasicDatePicker = lazy(() => import('./BasicDatePicker'))


const UpperContainer = (props) => {

    const { media700W, media600W , media500W } = useContext(widthContext)

    const {                
        userData,
        imgURL,
        setImgURL,
        handleEditUser,
        handleLogout,
        handleAddFoodItem,
        handleServerErrors,
        curDate,
        setCurDate,
        handleChangePassword,
        totals
    } = props;


    //aleast 700 width
    if (media700W){
        return (
            <Paper elevation={2} className = "upperContainer"  sx = {{flexDirection : "row"}}>

                <div className = "profileContainer" style = {{ borderRight : "black solid 1px" }}>
                    <ProfileDisplay 
                        userData = {userData} 
                        imgURL = {imgURL} 
                        setImgURL = {setImgURL}
                        handleServerErrors = {handleServerErrors}
                        width = {125}
                        height = {125}
                        />

                    <hr style = {{width: '100%'}}></hr>
                    
                    <UserControlButtons 
                        size = {"small"}
                        handleEditUser = {handleEditUser} 
                        handleChangePassword = {handleChangePassword} 
                        handleLogout = {handleLogout}
                        />

                    <hr style = {{width: '100%'}}></hr>
                    <Button size = "small" style = {{textTransform : "none"}} onClick={handleAddFoodItem}>Add to Food Database</Button>
                    <hr style = {{width: '100%'}}></hr>

                    <Suspense>
                        <BasicDatePicker curDate = {curDate} setCurDate = {setCurDate} />
                    </Suspense>
                </div>

                {/* This should be its own component, just for now Ill put the lazy loading bit here in day */}
                <div className = "rightSide" style = {{width: "50%"}}>
                    <h2 style ={{marginBottom : "0px"}} >Daily Totals</h2>
                    <div className ="totalsDisplay">
                        <hr style = {{width : "100%"}}></hr>
                        <ChartContainer totals = {totals} width = {300} height = {150}/>
                        <hr style = {{width : "100%", marginTop : "10px"}}></hr>
                        <TotalsTable totals = {totals} media700W = {media700W} fontSize = {"13px"}/>
                    </div>
                </div>
            </Paper>   
        )
    }
    else if (media600W){
        return (
            <Paper elevation={2} className = "upperContainer"  sx = {{flexDirection : "row"}}>

                <div className = "profileContainer" style = {{ borderRight : "black solid 1px" }}>
                    <ProfileDisplay 
                        userData = {userData} 
                        imgURL = {imgURL} 
                        setImgURL = {setImgURL}
                        handleServerErrors = {handleServerErrors}
                        width = {100}
                        height = {100}
                        />

                    <hr style = {{width: '100%'}}></hr>
                    
                    <UserControlButtons 
                        size = {"small"}
                        handleEditUser = {handleEditUser} 
                        handleChangePassword = {handleChangePassword} 
                        handleLogout = {handleLogout}
                        />

                    <hr style = {{width: '100%'}}></hr>
                    <Button size = "small" style = {{textTransform : "none"}} onClick={handleAddFoodItem}>Add to Food Database</Button>
                    <hr style = {{width: '100%'}}></hr>

                    <Suspense>
                        <BasicDatePicker curDate = {curDate} setCurDate = {setCurDate} />
                    </Suspense>
                </div>

                {/* This should be its own component, just for now Ill put the lazy loading bit here in day */}
                <div className = "rightSide" style = {{width: "50%"}}>
                    <h2 style ={{marginBottom : "0px", fontSize : "17px"}} >Daily Totals</h2>
                    <div className ="totalsDisplay">
                        <hr style = {{width : "100%"}}></hr>
                        <ChartContainer totals = {totals} width = {200} height = {150}/>
                        <hr style = {{width : "100%", marginTop : "10px"}}></hr>
                        <TotalsTable totals = {totals} media700W = {media700W} fontSize = {"11px"}/>
                    </div>
                </div>
            </Paper>   
        )
    }
    else if (media500W){
        return (
            <Paper elevation={2} sx = {{flexDirection : "column"}}>
                <div style = {{display: "flex", flexDirection : "row"}}>
                <div className = "profileContainer" style = {{ borderRight : "black solid 1px" }}>
                    <ProfileDisplay 
                        userData = {userData} 
                        imgURL = {imgURL} 
                        setImgURL = {setImgURL}
                        handleServerErrors = {handleServerErrors}
                        width = {75}
                        height = {75}
                        />

                    <hr style = {{width: '100%'}}></hr>
                    
                    <UserControlButtons 
                        size = {"small"}
                        handleEditUser = {handleEditUser} 
                        handleChangePassword = {handleChangePassword} 
                        handleLogout = {handleLogout}
                        />

                    <hr style = {{width: '100%'}}></hr>
                    <Button size = "small" style = {{textTransform : "none"}} onClick={handleAddFoodItem}>Add to Food Database</Button>

                </div>

                {/* This should be its own component, just for now Ill put the lazy loading bit here in day */}
                <div className = "rightSide" style = {{width: "50%"}}>
                    <h2 style ={{marginBottom : "0px", fontSize : "17px"}} >Daily Totals</h2>
                    <div className ="totalsDisplay">
                        <hr style = {{width : "100%"}}></hr>
                        <ChartContainer totals = {totals} width = {150} height = {100}/>
                        <hr style = {{width : "100%", marginTop : "10px"}}></hr>
                    </div>
                    
                    <Suspense>
                        <BasicDatePicker curDate = {curDate} setCurDate = {setCurDate} />
                    </Suspense>
                </div>
                </div>
                <hr style = {{width: '100%'}}></hr>

                <TotalsTable totals = {totals} media700W = {media700W} fontSize = {"14px"}/>

            </Paper>   
        )
    }
    else {
        return (
            <Paper elevation={2} sx = {{flexDirection : "column"}}>
                <div style = {{display: "flex", flexDirection : "column"}}>
                    <div className = "profileContainer" style = {{ width : "100%" }}>
                        <ProfileDisplay 
                            userData = {userData} 
                            imgURL = {imgURL} 
                            setImgURL = {setImgURL}
                            handleServerErrors = {handleServerErrors}
                            width = {75}
                            height = {75}
                            />

                        <hr style = {{width: '100%'}}></hr>
                        {/*User buttons and add to food database button should be in a drawer as well*/}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                    <p style = {{margin : "0px"}}>User Controls</p>
                            </AccordionSummary>
                            <AccordionDetails>
                                <MenuList dense>
                                    <MenuItem onClick = {handleEditUser}>Edit Profile</MenuItem>
                                    <MenuItem onClick = {handleChangePassword}>Change Password</MenuItem>
                                    <MenuItem onClick = {handleLogout}>Logout</MenuItem>
                                    <MenuItem onClick = {handleAddFoodItem}>Add to Food Database</MenuItem>
                                </MenuList>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    {/* This should be its own component, just for now Ill put the lazy loading bit here in day */}
                    <div className = "rightSide" style = {{ width : "100%" }}>
                    <hr style = {{width : "100%"}}></hr>

                        {/*The daily totals chart should be in a drawer */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                    <p style = {{margin : "0px"}}>Daily Totals</p>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className ="totalsDisplay">
                                    <hr style = {{width : "100%"}}></hr>
                                    <ChartContainer totals = {totals} width = {150} height = {100}/>
                                    <hr style = {{width : "100%", marginTop : "10px"}}></hr>
                                </div>
                                <TotalsTable totals = {totals} media700W = {media700W} fontSize = {"14px"}/>
                            </AccordionDetails>
                        </Accordion>



                    </div>
                </div>
                <hr style = {{width: '100%'}}></hr>

                <Suspense>
                        <BasicDatePicker curDate = {curDate} setCurDate = {setCurDate} />
                </Suspense>
            </Paper>   
        )
    }
}

export default UpperContainer;