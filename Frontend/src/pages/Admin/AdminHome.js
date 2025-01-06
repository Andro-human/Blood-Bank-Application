import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";
import API from "../../services/API";
import moment from "moment";

const AdminHomePage = () => {
  // Example data for charts
  const { user } = useSelector((state) => state.auth);
  const [totalDonations, setTotalDonations] = useState();
  const [totalAvailable, setTotalAvailable] = useState();
  const [bloodWiseAvailable, setBloodWiseAvailable] = useState([]);
  const [recentDonations, setRecentDonations] = useState();
  const [recentDonationsByQuater, setRecentDonationsByQuater] = useState([]);
  const [lastSevenDonations, setLastSevenDonations] = useState([]);

  const getTotalDonations = async () => {
    try {
      const { data } = await API.get("/admin/total-donations");
      if (data?.success) setTotalDonations(data?.totalRecords);
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalAvailable = async () => {
    try {
      const { data } = await API.get("/admin/total-available");
      if (data?.success) {
        setTotalAvailable(data?.totalAvailable);
        setBloodWiseAvailable(data?.bloodWiseAvailable);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getRecentActivity = async () => {
    try {
      const { data } = await API.get("/admin/recent-activity");
      if (data?.success) setRecentDonations(data?.lastWeekRecords);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecentActivityByQuater = async () => {
    try {
      const { data } = await API.get("/admin/total-donations-quater");
      if (data?.success) {
        setRecentDonationsByQuater(data?.activityByMonth);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLastSevenDonations = async () => {
    try {
      const { data } = await API.get("/admin/last-seven-donations");
      if (data?.success) {
        setLastSevenDonations(data?.last7Records);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTotalAvailable();
    getTotalDonations();
    getRecentActivity();
    getRecentActivityByQuater();
    getLastSevenDonations();
  }, []);

  const bloodGroupData = bloodWiseAvailable.map((item) => ({
    name: item.bloodGroup,
    value: item.currAvailable,
  }));

  const COLORS = [
    "#FF5733",
    "#33FF57",
    "#3375FF",
    "#FF33D1",
    "#FF8C33",
    "#33FFF5",
  ];

  return (
    <Layout>
      {/* Main Content */}
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Welcome {user?.name}!
        </Typography>

        {/* Summary Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Donations</Typography>
                <Typography variant="h4" sx={{ color: "#FF5733" }}>
                  {totalDonations}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Available Stock</Typography>
                <Typography variant="h4" sx={{ color: "#3375FF" }}>
                  {totalAvailable}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Recent Activities</Typography>
                <Typography variant="h4" sx={{ color: "#FF33D1" }}>
                  {recentDonations}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Chart Section */}
        <Grid container spacing={4} sx={{ marginTop: "20px" }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Blood Group Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bloodGroupData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                    >
                      {bloodGroupData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Donation Trends</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={recentDonationsByQuater}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="donations"
                      stroke="#FF5733"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activities */}
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Recent Activities
          </Typography>
          <table
            className="table"
            style={{
              width: "95%",
              margin: "auto",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                <th scope="col">Blood Group</th>
                <th scope="col">Inventory Type</th>
                <th scope="col">Quantity</th>
                <th scope="col">Email</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {lastSevenDonations?.map((record) => (
                <tr key={record._id}>
                  <td>{record.bloodGroup}</td>
                  <td>{record.inventoryType}</td>
                  <td>{record.quantity}</td>
                  <td>{record.email}</td>
                  <td>
                    {moment(record.createdAt).format("DD/MM/YYY hh:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Layout>
  );
};

export default AdminHomePage;
