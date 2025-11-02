import axios from "axios";

const axiosInstance = axios.create({
  // Local
  baseURL: "http://localhost:5000/api",
  //Remote (at the time of deployment)
  // baseURL: "https://backend.abegarage.abenezerzewge.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
