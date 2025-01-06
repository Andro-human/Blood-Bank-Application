import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API"
import moment from "moment";
import { toast } from "react-toastify";

const DonorList = () => {
  const [data, setData] = useState([]);

  //find donor records
  const getDonors = async () => {
    try {
      const { data } = await API.get("/admin/donor-list");
      if (data?.success)
        setData(data.donorData)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDonors();
  }, []);

  const handleDelete = async (id) => {
    try {
      let answer = window.confirm('Are you sure you want to delete this donor?', 'Yes')
      if (!answer) return;
      const {data} = await API.delete(`/admin/delete-user/${id}`);
      if (data?.success) {
        toast.success(data?.message);
        window.location.reload()
      }
      else toast.error(data?.message);
      
    } catch (error) {
      
    }
  }

  return (
    <Layout>
       <table className="table" style={{
          width: "95%",
          margin: "auto",
          marginTop: "20px",
          marginBottom: "20px"
       }}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((record) => (
                <tr key={record._id}>
                  <td>{record.name || record.organisationName + " (ORG)"}</td>
                  <td>{record.email}</td>
                  <td>{record.phone}</td>
                  <td>
                    {moment(record.createdAt).format("DD/MM/YYY hh:mm A")}
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(record._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    </Layout>
  );
};

export default DonorList;
