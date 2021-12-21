import React, { useEffect } from "react";
import axios from "../../requestHandler";

const useTreatment = () => {
  const [treatmentStop, setTreatmentStop] = React.useState([]);
  useEffect(() => {
    async function getTreatmentStop() {
      const request = await axios.get(`/api/v1/facility/treatment`);
      setTreatmentStop(request.data.list);
    }
    //get
    getTreatmentStop();
  }, []);

  return [treatmentStop];
};

export default useTreatment;
