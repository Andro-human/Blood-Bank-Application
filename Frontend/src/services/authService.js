import { toast } from "react-toastify";
import store from "../redux/store";
import {registerUser, userLogin} from "../redux/features/auth/authAction";

export const handleLogin = (e, email, password, role) => {
  e.preventDefault();
  try {
    if (!email || !password) {
      toast.error("Please Provide All Fields");
      return;
    }
    store.dispatch(userLogin({ email, password, role }));
  } catch (error) {
    console.log(error);
  }
};

export const handleRegister = (
  e,
  name,
  role,
  email,
  password,
  organisationName,
  hospitalName,
  website,
  address,
  phone
) => {
  e.preventDefault();
  try {
    if (!email) {
      toast.error("Please Provide An Email Address");
      return;
    }
    if (!password) {
      toast.error("Please Provide A Password");
      return;
    }
    if (!address) {
      toast.error("Please Provide an Address");
      return;
    }
    if (!phone) {
      toast.error("Please Provide A Phone Number");
      return;
    }

    store.dispatch(
      registerUser({
        name,
        role,
        email,
        password,
        organisationName,
        hospitalName,
        website,
        address,
        phone,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
