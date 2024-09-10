import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../services/API";
import { toast } from "react-toastify";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ role, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/login", { role, email, password });
      //store token
      if (data.success) {
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        if (role === 'donor' || role === 'hospital') {
          window.location.replace('/organisation');  
        }
        else
          window.location.replace('/');
      }
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


export const userRegister = createAsyncThunk(
  "auth/register",
  async (
    {
      name,
      role,
      email,
      password,
      organisationName,
      hospitalName,
      website,
      address,
      phone,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await API.post(
        "/auth/register",
        {
          name,
          role,
          email,
          password,
          organisationName,
          hospitalName,
          website,
          address,
          phone,
        },
        { rejectWithValue }
      );

      return data; // Return the data from the API call
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Handle the success and failure cases separately
const handleSuccess = (data) => {
  if (data.success) {
    // alert("User Registered Successfully")
    toast.success(data.message);
    window.location.replace("/login");
  }
};

const handleFailure = (error) => {
  // Handle failure cases, e.g., show an error toast
  toast.error("Registration failed: " + error);
};

// Create a separate thunk for dispatching actions after the API call
export const registerUser = (userData) => async (dispatch) => {
  try {
    const result = await dispatch(userRegister(userData));
    handleSuccess(result.payload);
  } catch (error) {
    handleFailure(error.payload);
  }
};


//current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async({rejectWithValue}) => {
    try {
      const res = await API.get('/auth/current-user')
      if (res?.data){      // res && res.data
        return res?.data
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
)

