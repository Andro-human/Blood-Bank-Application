import React, { useEffect } from "react";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "../../components/shared/Spinner";
import { toast } from "react-toastify";

const Register = () => {
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div
        className="container"
        style={{
          backgroundImage: 'url("./assets/images/register.jpg")',
          backgroundSize: "cover", 
          backgroundPosition: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              width: "80vh",
              height: "90vh",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <div
              style={{
                margin: "30px",
              }}
            >
              <Form
                formTitle={"Register"}
                submitBtm={"Register"}
                formType={"Register"}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
