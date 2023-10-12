import React from 'react'
import App from './App.jsx'
import './index.css'


import useMediaQuery from '@mui/material/useMediaQuery';
//This is used in the standalone app only
//It is to provide media queries   


const AppEntry = () => {
    const media700W = useMediaQuery('(min-width : 700px)')
    const media600W = useMediaQuery('(min-width : 600px)')
    const media500W = useMediaQuery('(min-width : 500px)')

    return <App media700W = {media700W} media600W = {media600W} media500W = {media500W}/>
}


export default AppEntry;