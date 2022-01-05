import Axios from "axios";

const request = Axios.create({
  baseURL:
    // "https://v2.smart-umodzi.com:443/"
    "https://api.v1.smart-umodzi.com:443/public/",
  // "http://127.0.0.1:8002/",
});
export default request;
