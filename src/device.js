import Axios from "axios";
const request = Axios.create({
  baseURL: "http://localhost:15896",
});
export default request;
