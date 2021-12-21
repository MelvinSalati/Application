import React from "react";
import { useEffect } from "react";
import axios from "../../requestHandler";

const useClinicians = () => {
  const hmis = sessionStorage.getItem("hmis");
  const [cliniciansList, setCliniciansList] = React.useState([]);
  useEffect(() => {
    async function getClinicians() {
      const request = await axios.get(`/api/v1/facility/clinicians/${hmis}`);
      setCliniciansList(request.data.clinicians);
    }
    getClinicians();
  }, [hmis]);
  return [cliniciansList];
};
export default useClinicians;
