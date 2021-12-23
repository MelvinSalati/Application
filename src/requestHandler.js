import Axios from "axios";

const request = Axios.create({
  baseURL: "https://v2.smart-umodzi.com:443/",
});
export default request;
