/*
TODO

-it looks like there is a lot of redundant information in this file being passed around

-Change search bar to styled

its working right now, it can definetlyt be cleaned up some more.

Search bar should have a search icon. Maybe make it the full width with a search icon button, and a cancel button

page things at the bottom can be styled better

obviously search functionality can be improved, but that is a serverside issue for the most part

a lot of these states can be cut down or consolidated

*/


import React, {useState, useContext} from "react";

//MaterialUI
import TextField from "@mui/material/TextField";

import Button from '@mui/material/Button';
import Card from "@mui/material/Card";

import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';


import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

//not using this. What was this for?
//import { useThemeProps } from "@mui/material/styles";

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';


import {serverSearch, addMealItemServerFunc, changeResultsPage} from "../../serverFunctions/serverFunctions";

import SearchResult from "./SearchResult";
import SearchResultInfo from "./SearchResultInfo"

import { widthContext } from '../../Contexts.js'

import "../../stylesheets/searchItemBackdrop.css"

const SearchResults = (props) => {
    const {
        searchResults, 
        searchDone,
        setDisplayIndividual,
        media700W,
        media600W,
        media500W
    } = props;

    const displaySearchResult = (result) => {
        setDisplayIndividual({bool : true, searchResult : result})
    }

    return (
        <div style = {{maxHeight : "40vH", minHeight : "100px", overflow: 'auto'}}>
            <TableContainer >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {/**style = {!media500W ? {fontSize : "12px"} : {fontSize : "14px"}} */}
                            <TableCell>Name</TableCell>
                            {media700W && <TableCell align="right">Serving Size</TableCell>}
                            <TableCell align="right">Calories</TableCell>
                            {media500W && <TableCell align="right">Fat&nbsp;(g)</TableCell>}
                            {media500W && <TableCell align="right">Carbs&nbsp;(g)</TableCell>}
                            {media500W && <TableCell align="right">Protein&nbsp;(g)</TableCell>}
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {searchResults.map( result => {
                                return <SearchResult 
                                    key = {result.foodItemID}
                                    result = {result} 
                                    displaySearchResult = {displaySearchResult}
                                    media700W = {media700W}
                                    media500W = {media500W}
                                    />
                            })}
                        </TableBody>
                </Table>
            </TableContainer>
                    {searchDone ? <></> : <div style = {{margin : "20px"}}> <CircularProgress /> </div>}
        </div>
    )
}

const SearchItemForm = (props) => {

    const { media700W, media600W , media500W } = useContext(widthContext)

    const {deny, handleServerErrors} = props;
    const [displayIndividual, setDisplayIndividual] = useState({bool : false, searchResult : {}})

    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchDone, setSearchDone] = useState(true);

    const [searchResults, setSearchResults] = useState([[], {count : 0}]);
    const [searchBoxText, setSearchBoxText] = useState("");
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearchBoxChange = (event) => {
        setSearchBoxText(event.target.value)
    }

    const handleSearch = () => {
        if(searchBoxText !== "")
        {  
            setSearchResults([[], {count : 0}]);
            setSearchDone(false);
            serverSearch(searchBoxText)
            .then(res => {
                setSearchResults(res)
                setPages(Math.ceil(res[1].count / 5))
                setSearchQuery(searchBoxText)
                setSearchDone(true);
            })
            .catch(error => {
                handleServerErrors(error)
                deny();
            })
        }
    }

    //this probably could be done differently
    const handleAddMealItem = (result, amount) => {
        addMealItemServerFunc(props.userID, props.meal, result.foodItemID, amount, props.curDate, props.token)
        .then(res => {
            //could probably do destructing or something            
            //should atleast reorganize this to be more consistent with mealItem structure in other places
            const mealItem = {
                name : result.name,
                loggedID : res.loggedID,
                brand : result.brand,
                servingSize : result.servingSize,
                servingUnit : result.servingUnit,
                calories : result.calories,
                fat : result.fat,
                carbs : result.carbs,
                protein : result.protein,
                amount : amount,
                meal: props.meal,
                date : props.curDate
            }
            props.mealDispatch({type : "ADDITEM", mealItem : mealItem})

        })
        .catch(error => {
            handleServerErrors(error)
            deny();
        })
    }

    const handleEnter = (e) => {
        if(e.key === "Enter"){
            handleSearch();
        }
    }

    const pageChangeHandler = (event, page) => {
        setCurrentPage(page)
        setSearchDone(false)
        setSearchResults([[], {count : 0}])
        changeResultsPage(searchQuery, page)
        .then(res => {
            setSearchDone(true);
            setSearchResults(res)
        })
        .catch(error => {
            handleServerErrors(error);
            deny();
        })
    }


    return (
        <>
        {displayIndividual.bool ?

            <SearchResultInfo searchResult = {displayIndividual.searchResult} setDisplayIndividual = {setDisplayIndividual} handleAddMealItem = {handleAddMealItem}/>

            :
        <Card className = "searchItemBackdrop" sx ={{border : "solid grey 2px"}}>
                <div>
                    <div style = {{textAlign : "left"}}>
                        <h2>Search The Database</h2>
                        <TextField 
                            size = "small" 
                            label = "Search" 
                            value = {searchBoxText} 
                            onChange = {handleSearchBoxChange} 
                            onKeyUp = {handleEnter} 
                            sx = {{width: "100%"}}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                        <IconButton 
                                            size = "small"
                                            onClick = {handleSearch}
                                            >
                                            <SearchIcon fontSize = "small"/>
                                        </IconButton>
                                    </InputAdornment>,
                              }}
                        />

                    </div>
                    <hr style = {{}}></hr>

                    <SearchResults
                        searchResults = {searchResults[0]}
                        searchDone = {searchDone}
                        setDisplayIndividual = {setDisplayIndividual}
                        media700W = {media700W}
                        media600W = {media600W}
                        media500W = {media500W}
                    />                    
                    <hr></hr>
                    <div className="searchItemButtons" style ={media500W ? {} : {flexDirection : "column", alignItems: "center"}}>
                        <Pagination count = {pages} onChange = {pageChangeHandler} style = {{paddingTop: "10px"}} page = {currentPage} size = {media600W ? "medium" :"small"}/>
                        <Button onClick = {deny}> Finish Search </Button>
                    </div> 
            </div>
        </Card>
        }
        </>
    )
}

export default SearchItemForm;