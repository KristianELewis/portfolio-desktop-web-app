
const reducer = (state, action) => {
    switch (action.type){
        case "ADDITEM":
            const newMealItems_ = [...state.mealItems, action.mealItem]
            return {...state, mealItems : newMealItems_};
        case "REMOVEITEM": //NEEDs to be renamed to deleteitem
            //possibly should be changed
            const index = state.mealItems.findIndex(data => data.loggedID === action.loggedID)
            const newarr = state.mealItems.toSpliced(index, 1)
            return {...state, mealItems : newarr}
        case "CHANGEAMOUNT":
            let newMealItems = state.mealItems.map(mealItem => {
                if (mealItem.loggedID === action.loggedID)
                {
                    return {...mealItem, amount : action.amount}
                }
                else{
                    return mealItem
                }
            })
            return {...state, mealItems : newMealItems}
        case "LOAD":
            //perhaps make this more generic, ie {...state }
            return { name: state.name, loaded: true, mealItems : action.mealItems, meal : state.meal};
    }
}

export default reducer;