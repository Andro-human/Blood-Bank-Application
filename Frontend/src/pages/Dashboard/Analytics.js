import Layout from '../../components/shared/Layout/Layout';
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from "@mui/material";
import API from "../../services/API";
import { toast } from "react-toastify";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [bloodData, setBloodData] = useState([]);

  const fetchBloodData = async () => {
    try {
      const { data } = await API.get("/analytics/bloodData");
      if (data?.success) {
        setBloodData(data.bloodGroupData);
      } else {
        toast.error("Failed to fetch blood data!");
      }
    } catch (error) {
      console.error("Error fetching blood data:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodData();
  }, []);

  const bloodGroups = [
    { type: "A+", color: "#FF5733" },
    { type: "A-", color: "#33FF57" },
    { type: "B+", color: "#3375FF" },
    { type: "B-", color: "#FF33D1" },
    { type: "O+", color: "#FF8C33" },
    { type: "O-", color: "#33FFF5" },
  ];

  return (
    <Layout>
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          <i className="fa-solid fa-chart-pie"></i> Blood Inventory Analytics
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4} style={{ marginTop: "2rem" }}>
            {bloodGroups.map((group) => {
              const blood = bloodData.find((b) => b.bloodGroup === group.type);
              return (
                <Grid item xs={12} sm={6} md={3} key={group.type}>
                  <Card
                    sx={{
                      borderLeft: `6px solid ${group.color}`,
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        backgroundColor: "#f9f9f9",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        align="center"
                        sx={{ color: group.color, fontWeight: "bold" }}
                      >
                        {group.type}
                      </Typography>
                      <Typography
                        variant="h6"
                        align="center"
                        sx={{ color: "#555", marginTop: "10px" }}
                      >
                        {blood
                          ? `${blood.totalAvailable} ML Available`
                          : "Data not available"}
                      </Typography>
                      {blood && (
                        <>
                          <Typography
                            variant="body2"
                            align="center"
                            sx={{ color: "#999", marginTop: "5px" }}
                          >
                            {`Total In: ${blood.totalIn} ML`}
                          </Typography>
                          <Typography
                            variant="body2"
                            align="center"
                            sx={{ color: "#999", marginTop: "5px" }}
                          >
                            {`Total Out: ${blood.totalOut} ML`}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default Analytics;
