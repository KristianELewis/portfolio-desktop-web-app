/*====================================================================================
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*====================================================================================

FOOD ITEM DATABASE FUNCTIONS

/*------------------------------------------------------------------------------------
ADD NEW FOOD ITEM TO DATABASE
no auth needed
used in AddFoodItem.jsx
name should change, confused with AddMealItemServerFunc
------------------------------------------------------------------------------------*/
//const hostURL = "http://localhost:3000"
const hostURL = "https://kristianlewis.com/caloriecounter"

import {serverErrorDecider} from './customErrors'
export async function addNewFoodItemConnect (name, brandName, servingSize, servingUnit, calories, carbs, fat, protein) {
    
    return fetch(hostURL + "/database-food/new-item", {
       method: "POST",
       body: JSON.stringify({
           name: name,
           brandName: brandName,
           servingSize : servingSize,
           servingUnit : servingUnit,
           calories: calories,
           carbs: carbs,
           fat : fat,
           protein: protein
       }
       ),
       headers: {
           "Content-type": "application/json; charset=UTF-8"
       }
       })
       .then(res => {
           //will either return the data or an error
           if(!res.ok){
               return serverErrorDecider(res)
           }
           return res.json()
       })
}


/*------------------------------------------------------------------------------------
SEARCH FOOD ITEM DATA BASE
no auth needed
used in SearchItemForm.jsx
------------------------------------------------------------------------------------*/
export async function serverSearch (searchBoxText) {

   const path = hostURL + `/database-food/${searchBoxText}`

   return (fetch(path, {
       method: "GET",
       headers: {
           "Content-type": "application/json; charset=UTF-8"
       }
   })
   .then(res =>{             
       if(!res.ok){
           return serverErrorDecider(res)
       }
       return res.json()
   }))
}

/*------------------------------------------------------------------------------------
SECONDARY SEARCH
no auth needed
used in SearchResultItemForm.jsx
different the SearchResult poor naming, should change
------------------------------------------------------------------------------------*/
export async function changeResultsPage(searchQuery, page) {

   const startingPoint = 5 * (page - 1);
   const path = hostURL + `/database-food/${searchQuery}/p${startingPoint}`

   return (fetch(path, {
       method: "GET",
       headers: {
           "Content-type": "application/json; charset=UTF-8"
       }
   })
   .then(res =>{             
       if(!res.ok){
           return serverErrorDecider(res)
       }
       return res.json()
   })
)}