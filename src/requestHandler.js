import Axios from "axios";

const request = Axios.create({
  baseURL: "https://95.216.225.167/~umodzixy/api.v1/public/",
  // baseURL: "https://api.train.smart-umodzi.com:443/public/",
  // baseURL: "http://127.0.0.1:8000/",
});
export default request;
