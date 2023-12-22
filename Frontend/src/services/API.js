import axios from 'axios'

const REACT_APP_BASEURL = "https://blood-bank-backend-l7bi.onrender.com/api/v1"
const API = axios.create({baseURL: REACT_APP_BASEURL})

API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return req;
});

export default API;