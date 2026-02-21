import axios from "axios";

const axiosInstance = axios.create({
  // Local
  // baseURL: "http://localhost:5000/api",
  //Remote
  baseURL: "https://backend.olisknitwear.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
