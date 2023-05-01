import { useEffect, useState } from "react";
import axios from "../requestHandler";
import Notiflix from "notiflix";
export default function useAppointmentsHook(uuid) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function clientAppointments() {
      const request = await axios.get(`/api/v1/client/appointments/${uuid}`);
      setAppointments(request.data.appointments);
    }
    clientAppointments();
    // Notiflix.Loading.remove();
  }, []);

  return [appointments];
}
