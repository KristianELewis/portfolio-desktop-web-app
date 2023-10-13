import React, {lazy, Suspense, useContext} from 'react'
import { windowWidthContext } from '../../Context';

//need to make it so there is only one instance of the calorie counter running at the same time

const App = lazy(() => import('./src/App'))
//At the moment, I am just copying and pasting the source folder into this project.
//There are probably other ways to do it, something about packing and using npm, but I don't really want to worry about managing 
//dependencie versions between the two projects like that right now. Just need to make it work after pasting it in and make a few minor adjustments

const mediaQueryDecider = (width, minWidth) => {
    if(width > minWidth)
    {
        return true;
    }
    return false;
}

const CalorieCounter = (props) => {

    const {width} = useContext(windowWidthContext);
    const media700W = mediaQueryDecider(width, 700);
    const media600W = mediaQueryDecider(width, 600);
    const media500W = mediaQueryDecider(width, 500);

    //this can probably be re arranged differently, but for now this works
    
    //info button should allow the user to navigate to the standalone version
    //need minimum height and widths
    return (
        <div style = {{height: "100%", overflow: 'auto', backgroundColor: "#242424"}}>
            <div style = {{display: "flex", placeItems: "center",  minHeight: "100%", position : "relative"}}>
                <div style = {{ margin : "auto", textAlign : "center", userSelect: "none"}}>
                    <Suspense>
                        <App media700W = {media700W} media600W = {media600W} media500W = {media500W}/>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default CalorieCounter;