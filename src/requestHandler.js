import Axios from "axios";

const request = Axios.create({
  baseURL:
    // "https://v2.smart-umodzi.com:443/"
    "http://127.0.0.1:8001",
});
export default request;
