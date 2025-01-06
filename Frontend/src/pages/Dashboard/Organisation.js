import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";
import { useSelector } from "react-redux";

const Organisation = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  //find org records
  const getOrganisations = async () => {
    try {
      if (user?.role === "donor") {
        const { data } = await API.get("/inventory/get-organisations-donor");
        if (data?.success) setData(data.organisations);
      }

      if (user?.role === "hospital") {
        const { data } = await API.get("/inventory/get-organisations-hospital");
        if (data?.success) setData(data.organisations);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrganisations();
  }, [user]);

  return (
    <Layout>
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
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Address</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((record) => (
            <tr key={record._id}>
              <td>{record.organisationName}</td>
              <td>{record.email}</td>
              <td>{record.phone}</td>
              <td>{record.address}</td>
              <td>{moment(record.createdAt).format("DD/MM/YYY hh:mm A")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Organisation;
