import React, { useEffect } from "react";
import axios from "../../requestHandler";

const useCreated = () => {
  const [createdList, setCreatedList] = React.useState([]);
  const hmis = sessionStorage.getItem("hmis");
  useEffect(() => {
    async function createdToday() {
      const request = await axios.get(`api/v1/appointments/created/${hmis}`);
      setCreatedList(request.data.list);
    }
    createdToday();
  }, []);
  return [createdList];
};
export default useCreated;
