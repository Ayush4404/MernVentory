import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // important for cookies
});
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  },
  withCredentials: true
}


export default API;
