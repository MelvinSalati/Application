import React, { useEffect } from "react";
import axios from "../../requestHandler";

const useCreated = () => {
  const [createdList, setCreatedList] = React.useState([]);
  useEffect(() => {
    async function createdToday() {
      const request = await axios.get(
        "/api/v1/facility/appointment/data/created"
      );
      setCreatedList(request.data.list);
    }
    createdToday();
  }, []);
  return [createdList];
};
export default useCreated;
