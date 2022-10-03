import Axios from "axios";

const request = Axios.create({
  // baseURL: "https://api.v1.smart-umodzi.com:443/public/",
  // baseURL: "https://api.train.smart-umodzi.com:443/public/",
  baseURL: "http://127.0.0.1:8000/",
});
export default request;
