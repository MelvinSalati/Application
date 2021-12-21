import React, { useEffect } from "react";
import axios from "../../requestHandler";

const useProvince = () => {
  const [province, setProvince] = React.useState([]);
  useEffect(() => {
    async function Province() {
      const request = await axios.get(`api/v1/facility/province/`);
      setProvince(request.data.provinces);
    }
    Province();
  }, []);

  return [province];
};
export default useProvince;
