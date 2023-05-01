import React, { useEffect } from "react";
import axios from "../requestHandler";
import { useState } from "react";
import Notiflix from "notiflix";
export default function useClientsDetails(uuid) {
  const [clientsDetails, setClientsData] = useState("");
  const [clientNames, setClientNames] = useState("");
  useEffect(() => {
    async function getClientsData() {
      await axios
        .get(`api/v1/client/details/${uuid}`)
        .catch((error) => {
          console.log(error);
        })
        .then((response) => {
          setClientsData(response.data[0]);
          setClientNames(response.data[0].first_name);
        });
    }
    getClientsData();
  }, []);

  return [clientsDetails, clientNames];
}
