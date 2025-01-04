import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Grid2,
  Box,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Layout from "../../components/shared/Layout/Layout";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [monthlyPredictions, setMonthlyPredictions] = useState([]);
  const [totalMonthly, setTotalMonthly] = useState();
  const [yearlyPrediction, setYearlyPrediction] = useState([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthlyDates = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return date.toISOString().split("T")[0];
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/predict/fetchMonthlyPredictions`)
      .then((response) => {
        console.log(`${process.env.REACT_APP_BASEURL}/api/v1/predict/fetchMonthlyPredictions`)
        const monthlyData = response.data;
        setMonthlyPredictions(monthlyData.data);
        setTotalMonthly(monthlyData.totalValue);
      })
      .catch((error) => {
        console.error("Error fetching monthly data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/predict/fetchYearlyPredictions`)
      .then((response) => {
        const YearlyData = response.data;
        setYearlyPrediction(YearlyData.data);
      })
      .catch((error) => {
        console.error("Error fetching yearly data:", error);
      });
  }, []);

  const chartDataMonthly = {
    labels: monthlyDates,
    datasets: [
      {
        label: "O+",
        data: monthlyPredictions["O+"],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 1)",
        fill: true,
      },
      {
        label: "O-",
        data: monthlyPredictions["O-"],
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgb(153, 102, 255)",
        fill: true,
      },
      {
        label: "A+",
        data: monthlyPredictions["A+"],
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgb(255, 159, 64)",
        fill: true,
      },
      {
        label: "A-",
        data: monthlyPredictions["A-"],
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgb(255, 206, 86)",
        fill: true,
      },
      {
        label: "B+",
        data: monthlyPredictions["B+"],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        fill: true,
      },
      {
        label: "B-",
        data: monthlyPredictions["B-"],
        borderColor: "rgb(56, 128, 255)",
        backgroundColor: "rgb(56, 128, 255)",
        fill: true,
      },
    ],
  };

  const chartDataYearly = {
    labels: months,
    datasets: [
      {
        label: "O+",
        data: yearlyPrediction["O+"],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 1)",
        fill: true,
      },
      {
        label: "O-",
        data: yearlyPrediction["O-"],
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgb(153, 102, 255)",
        fill: true,
      },
      {
        label: "A+",
        data: yearlyPrediction["A+"],
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgb(255, 159, 64)",
        fill: true,
      },
      {
        label: "A-",
        data: yearlyPrediction["A-"],
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgb(255, 206, 86)",
        fill: true,
      },
      {
        label: "B+",
        data: yearlyPrediction["B+"],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        fill: true,
      },
      {
        label: "B-",
        data: yearlyPrediction["B-"],
        borderColor: "rgb(56, 128, 255)",
        backgroundColor: "rgb(56, 128, 255)",
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

        <Grid2
          container
          style={{
            alignItem: "center",
            justifyContent: "center",
            padding: "2rem",
            gap: "2rem",
          }}
        >
          <Grid2
            item
            xs={12}
            sm={6}
            style={{ border: "2px black solid", padding: "1rem" }}
          >
            <Typography variant="h6" gutterBottom>
              Monthly Blood Demand Prediction
            </Typography>
            <Line
              style={{ height: "20rem", width: "25rem" }}
              data={chartDataMonthly}
            />
          </Grid2>

          <Grid2
            item
            xs={12}
            sm={6}
            style={{ border: "2px black solid", padding: "1rem" }}
          >
            <Typography variant="h6" gutterBottom>
              Yearly Blood Demand Prediction
            </Typography>

            <Line
              data={chartDataYearly}
              style={{ height: "20rem", width: "25rem" }}
            />
          </Grid2>
        </Grid2>

        <Box
          sx={{
            padding: "16px", 
            backgroundColor: "#8ecae6",
            borderRadius: "8px", 
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            fontSize: "16px", 
            color: "#333", 
            fontWeight: "bold", 
            textAlign: "center", 
            marginTop: "16px", 
            marginBottom: "16px", 
          }}
        >
          Total Predicted Demand for the next month: {Math.round(totalMonthly)}
        </Box>
      </div>
    </Layout>
  );
};

export default App;
