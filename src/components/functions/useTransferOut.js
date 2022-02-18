import React, { useEffect } from "react";
import axios from "../../requestHandler";

const useTransferOut = () => {
  const [transferData, setTransferData] = React.useState([]);
  const hmis = sessionStorage.getItem("hmis");
  useEffect(() => {
    async function getTransferOut() {
      const request = await axios.get(`/api/v1/facility/transferout/${hmis}`);
      setTransferData(request.data.list);
    }
    //get
    getTransferOut();
  }, []);

  return [transferData];
};

export default useTransferOut;
