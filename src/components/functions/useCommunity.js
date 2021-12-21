import React from "react";
import { useEffect } from "react";
import axios from "../../requestHandler";

const useCommunity = () => {
  const hmis = sessionStorage.getItem("hmis");
  const [communityList, setCommunityList] = React.useState([]);
  useEffect(() => {
    async function getCommunity() {
      const request = await axios.get(`/api/v1/facility/community/${hmis}`);
      setCommunityList(request.data.community);
    }
    getCommunity();
  }, [hmis]);
  return [communityList];
};
export default useCommunity;
