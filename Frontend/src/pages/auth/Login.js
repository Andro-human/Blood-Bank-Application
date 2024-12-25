import { useEffect } from "react";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "./../../components/shared/Spinner";
import { toast } from "react-toastify";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);

  // Display the error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <>
      {/* ternary operator */}
      {loading ? (
        <Spinner />
      ) : (
        <div
          className="container"
          style={{
            backgroundImage: 'url("./assets/images/login.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
           
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          width: "32vmax",
          height: "60vh",
          justifyContent: "center",
          display: "flex",
        }}>
          <div style={{            
          margin: "30px", 
          width: "21vmax"           
          }}>
            <Form formTitle={"Login"} submitBtm={"Login"} formType={"Login"}/>
          </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
