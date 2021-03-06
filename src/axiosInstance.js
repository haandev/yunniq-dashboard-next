import axios from "axios";
import { BASE_URL } from "./const";

const axiosInstance = axios.create({
  //baseURL: "https://cors-anywhere.herokuapp.com/http://78.141.232.137:80"
  baseURL: BASE_URL
});
axiosInstance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
export default axiosInstance;
