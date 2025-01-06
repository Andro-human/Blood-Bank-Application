import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../components/shared/Spinner.js";
import { toast } from "react-toastify";
import Layout from "../components/shared/Layout/Layout.js";
import "../styles/homePage.css";
import API from "../services/API.js";
import moment from "moment";
import Modal from "../components/shared/modal/Modal.js";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const { loading, error, user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const navigate = useNavigate()

  //get function
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-inventory");
      if (data?.success) {
        setData(data?.inventory);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodRecords();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <Layout>
      {user?.role === 'admin' && navigate('admin')}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h4
            className="ms-4"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            style={{ cursor: "pointer" }}
          >
            Add Inventory
            <i
              className="fa-solid fa-plus py-4 ms-1"
              style={{ color: "#000000" }}
            ></i>
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Blood Group</th>
                <th scope="col">Inventory Type</th>
                <th scope="col">Quantity</th>
                <th scope="col">Email</th>
                <th scope="col">Time & date</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((record) => (
                <tr key={record._id}>
                  <td>{record.bloodGroup}</td>
                  <td>{record.inventoryType}</td>
                  <td>{record.quantity} (ML)</td>
                  <td>{record.email}</td>
                  <td>
                    {moment(record.createdAt).format("DD/MM/YYY hh:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal />
        </>
      )}
    </Layout>
  );
};

export default HomePage;
