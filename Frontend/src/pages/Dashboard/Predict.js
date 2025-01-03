import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Snackbar, Button, Typography, MenuItem, Select, InputLabel, FormControl, Grid2, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Layout from '../../components/shared/Layout/Layout';
import { toast } from 'react-toastify';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [predictedDemand, setPredictedDemand] = useState(null);
  const [daysToPredict, setDaysToPredict] = useState(1);
  const [monthSelected, setMonthSelected] = useState('');
  const [yearlyPrediction, setYearlyPrediction] = useState([]);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthlyDates = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1); // Increment date
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/predictions')
      .then(response => {
        const monthlyData = response.data;
        console.log("monthlyData", monthlyData);
        setHistoricalData(monthlyData);
      })
      .catch(error => {
        console.error('Error fetching historical data:', error);
      });
  }, []);

  const handlePredict = () => {
    axios.post('http://localhost:5000/api/predict', { month: monthSelected })
      .then(response => {
        setPredictedDemand(response.data.predictedDemand);
      })
      .catch(error => {
        console.error('Error predicting demand:', error);
      });
  };

  const handleMonthSelect = (event) => {
    setMonthSelected(event.target.value);
  };

  const handleYearPrediction = () => {
    const predictions = months.map((_, index) => ({
      month: months[index],
      demand: Math.floor(Math.random() * 100) + 50, // Random prediction between 50 and 150
    }));
    setYearlyPrediction(predictions);
  };

  const chartDataMonthly = {
    labels: monthlyDates,
    datasets: [
      {
        label: 'O+',
        data: historicalData["O+"]?.monthly_averages,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 1)',
        fill: true,
      },
      {
        label: 'O-',
        data: historicalData["O-"]?.monthly_averages,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgb(153, 102, 255)',
        fill: true,
      },
      {
        label: 'A+',
        data: historicalData["A+"]?.monthly_averages,
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgb(255, 159, 64)',
        fill: true,
      },
      {
        label: 'A-',
        data: historicalData["A-"]?.monthly_averages,
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgb(255, 206, 86)',
        fill: true,
      },
      {
        label: 'B+',
        data: historicalData["B+"]?.monthly_averages,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        fill: true,
      },
      {
        label: 'B-',
        data: historicalData["B-"]?.monthly_averages,
        borderColor: 'rgb(56, 128, 255)',
        backgroundColor: 'rgb(56, 128, 255)',
        fill: true,
      }
    ],
    
  };

  const chartDataYearly = {
    labels: months,
    datasets: [
      {
        label: 'Blood Demand (Yearly)',
        data: yearlyPrediction.map(item => item.demand),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <Layout>
     <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Blood Demand Forecast
      </Typography>

      <Grid2 container style={{alignItem: "center" , justifyContent: "center", padding: "2rem", gap: '5rem' }}>
        <Grid2 item xs={12} sm={6} style={{border:"2px black solid", padding:"1rem"}}>
          <Typography variant="h6" gutterBottom>
            Monthly Blood Demand Prediction
          </Typography>
          <Line style={{height: "20rem", width: "30rem"}} data={chartDataMonthly} />
        </Grid2>

        <Grid2 item xs={12} sm={6} style={{border:"2px black solid", padding: "1rem"}}>
          <Typography variant="h6" gutterBottom >
            Yearly Blood Demand Prediction
          </Typography>
          <Button variant="contained"  onClick={handleYearPrediction} style={{ marginBottom: 20 }}>
            Generate Yearly Prediction
          </Button> 
         
          <Line data={chartDataYearly} style={{height: "20rem", width: "30rem"}} />
          
        </Grid2>
      </Grid2>

      <Box style={{ marginTop: 40 }}>
        <FormControl fullWidth style={{ marginBottom: 20 }}>
          <InputLabel>Choose Month</InputLabel>
          <Select
            value={monthSelected}
            onChange={handleMonthSelect}
            label="Choose Month"
          >
            {months.map((month, index) => (
              <MenuItem key={index} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (monthSelected) {
              // handlePredict();
              toast.success(`Predicted Blood Demand for ${monthSelected}: ${Math.floor(Math.random() * 100) + 50}`, {
                position: "bottom-center",
              });
            }
            else {
              toast.error("Month not selected")
            }
          }}
        >
          Get Predicted Demand for Selected Month
        </Button>
      </Box>
        
      {/* {monthSelected !== null && (
<       Typography variant="h6" style={{ marginTop: 20 }}>
          Predicted Blood Demand for {monthSelected}: {Math.floor(Math.random() * 100) + 50}
        </Typography>
      )} */}
      {/* {predictedDemand !== null && (
<        Typography variant="h6" style={{ marginTop: 20 }}>
          Predicted Blood Demand in {daysToPredict} days: {predictedDemand}
        </Typography>
      )} */}
    </div>
    </Layout>
  );
};

export default App;
