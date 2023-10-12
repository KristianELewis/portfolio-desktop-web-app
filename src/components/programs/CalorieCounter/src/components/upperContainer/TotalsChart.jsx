/*
TODO
-this chart may be unecessary, or there may be a more light weight way of doing this

this curently adds 161.21 Kb to the finished project size, not sure if there is a way to reduce the size
*/

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const TotalsChart = (props) => {

  //this will most likely be different from the recorded calories due to inaccuracies in reported calories vs nutrients
  const calories = (props.protein * 4) + (props.carbs * 4) + (props.fat * 9)
  const protein = Math.round((props.protein *4) /calories * 100)
  const carbs = Math.round((props.carbs * 4) /calories * 100)
  const fat = Math.round((props.fat * 9) /calories * 100)

    const data = {
        labels: ['Protein', 'Carbs', 'Fat'],
        datasets: [
        {
            data: [protein, carbs, fat],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',

            ],
            borderWidth: 1,
        },
        ],
    };
    const options = {
        //responsive : false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'left',
            labels: {usePointStyle: true}/*
            maybe switch to pointed labels if width gets too small (responsive)
            */
          },
          tooltip: {
            enabled : true,
            displayColors: false,
            callbacks : {
              label : function(context) {
                let data = context.dataset.data[context.dataIndex] + "%"
                return data
              }
            }
          }
        }
      }
    return <Pie data={data} options = {options} />;
}


export default TotalsChart;