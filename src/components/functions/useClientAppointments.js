import React from "react";
import axios from "../../requestHandler";
import { useEffect } from "react";

const useClientAppointments = (clientUuid) => {
  const [clientAppointments, setClientAppointments] = React.useState("");
  useEffect(() => {
    async function appointments() {
      const request = await axios.get(
        `/api/v1/client/appointments/${clientUuid}`
      );
      setClientAppointments(request.data.appointments);
    }
    //appointments
    if (clientUuid) {
      appointments();
    }
  }, [clientUuid]);
  return [clientAppointments];
};
export default useClientAppointments;
