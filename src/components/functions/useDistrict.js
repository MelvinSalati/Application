import React, { useEffect } from "react";
import axios from "../../requestHandler";

const useDistrict = (province) => {
  const [district, setDistrict] = React.useState([]);
  useEffect(() => {
    async function District() {
      const request = await axios.get(`api/v1/facility/district/${province}`);
      setDistrict(request.data.districts);
    }
    District();
  }, [province]);

  return [district];
};
export default useDistrict;
