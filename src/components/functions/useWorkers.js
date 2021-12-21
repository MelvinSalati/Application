import React from "react";
import { useEffect } from "react";
import axios from "../../requestHandler";

const useWorkers = () => {
  const [users, setUsers] = React.useState([]);
  const hmis = sessionStorage.getItem("hmis");

  useEffect(() => {
    async function getUsers() {
      const request = await axios.get(`api/v1/facility/users/${hmis}`);
      setUsers(request.data.users);
    }
    getUsers();
  }, [hmis]);

  return [users];
};

export default useWorkers;
