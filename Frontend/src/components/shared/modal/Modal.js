import React, { useState } from "react";
import { useSelector } from "react-redux";
import InputType from "../Form/InputType";
import { toast } from "react-toastify";
import API from "../../../services/API";
import "../../../styles/modal.css";

const Modal = () => {
  const [inventoryType, setInventoryType] = useState("in");
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [email, setEmail] = useState("");
  // const [hospitalEmail, setHospitalEmail] = useState("");

  const { user } = useSelector((state) => state.auth);
  // handle modal data
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!bloodGroup || !email) return toast.error("Please Provide all field");
      if (quantity < 1) {
        return toast.error("Please input a valid Quantity");
      }
      const { data } = await API.post("/inventory/create-inventory", {
        email,
        organisation: user?._id,
        inventoryType,
        bloodGroup,
        quantity,
      });

      if (data?.success) {
        toast.success("New Record Created");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Manage Blood Record
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form onSubmit={handleModalSubmit}>
              <div className="modal-body">
                <div className="d-flex mb-3">
                  Blood Type: &nbsp;
                  <div className="form-check ms-3">
                    <input
                      type="radio"
                      name="Radio"
                      className="form-check-input"
                      value={"in"}
                      onChange={(e) => setInventoryType(e.target.value)}
                      defaultChecked
                    />
                    <label htmlFor="in" className="form-check-label">
                      IN
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="Radio"
                      className="form-check-input ms-3 me-1"
                      value={"out"}
                      onChange={(e) => setInventoryType(e.target.value)}
                    />
                    <label htmlFor="out" className="form-check-label">
                      OUT
                    </label>
                  </div>
                </div>
              </div>

              <div className="form">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  <option defaultValue={`Select Blood Group Type`}>
                    Select Blood Group Type
                  </option>
                  <option value={"O+"}>O+</option>
                  <option value={"O-"}>O-</option>
                  <option value={"AB+"}>AB+</option>
                  <option value={"AB-"}>AB-</option>
                  <option value={"A+"}>A+</option>
                  <option value={"A-"}>A-</option>
                  <option value={"B+"}>B+</option>
                  <option value={"B-"}>B-</option>
                </select>

                {inventoryType === "in" && (
                  <InputType
                    labelText={"Donor Email"}
                    labelFor={"DonorEmail"}
                    inputType={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}

                {inventoryType === "out" && (
                  <InputType
                    labelText={"Hospital Email"}
                    labelFor={"HospitalEmail"}
                    inputType={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}

                <InputType
                  labelText={"Quantity (ML)"}
                  labelFor={"quantity"}
                  inputType={"Number"}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
