
//this should be replaced and removed. unecessary to have a reducer for this


//this is fucking awful. I hate this so much. I'm deleting this as soon as possible
const backdropReducer = (state, action) => {

    switch (action.type){
        case "EDITUSER":
            return {open : true, choice : 0, loggedID : -1};
        case "ADDDATABASEITEM":
            return {open : true, choice : 1, loggedID : -1};
        case "ADDITEM":
            return {open : true, choice : 2, loggedID : -1, dispatch : action.dispatch, meal : action.meal};
        case "MEALITEMINFO":
            return {open : true, choice : 3, loggedID : action.loggedID, dispatch : action.dispatch, mealItem : action.mealItem};
        case "CHANGEPASSWORD":
            return {open : true, choice : 4, loggedID : -1};
        case "CLOSEBACKDROP":
            return {open : false, choice : -1};
    }
}

export default backdropReducer;