import Axios from "axios";
const request = Axios.create({
  baseURL: "https://fpsvr101.cloudabis.com/v1/",
  headers: {
    Authorization: "Bearer " + sessionStorage.getItem("token"),
  },
});
export default request;
