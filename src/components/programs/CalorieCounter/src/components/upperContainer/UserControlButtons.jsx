import React from 'react'

import Button from '@mui/material/Button';


const UserControlButtons = (props) => {

    const { handleEditUser, handleChangePassword, handleLogout, size } = props;

    return (
        <div className = "UserButtons">
            <Button size = {size} style = {{textTransform : "none"}} onClick = {handleEditUser}>Edit Profile</Button>
            <Button size = {size} style = {{textTransform : "none"}} onClick = {handleChangePassword}>Change Password</Button>
            <Button size = {size} style = {{textTransform : "none"}} onClick = {handleLogout}>Logout</Button>
        </div>
    )
}

export default UserControlButtons;