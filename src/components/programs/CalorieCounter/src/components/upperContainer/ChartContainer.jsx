import React, {lazy, Suspense} from 'react'

const TotalsChart = lazy(() => import('./TotalsChart'))


const ChartContainer = (props) => {
    
    const { totals, width, height } = props;

    return (<>
        <p style = {{marginBottom : "10px", marginTop : "0px", fontSize: "14px"}}>Percent of calories by nutrient</p>

        <div className ="chartContainer" style = {{positions : "relative", width: width, height: height}}>
            <Suspense>
                <TotalsChart
                    carbs = {totals.carbs}
                    protein = {totals.protein}
                    fat = {totals.fat}
                />
            </Suspense>
        </div>
        </>
    )
}

export default ChartContainer;

//