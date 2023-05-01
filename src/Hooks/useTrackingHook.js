import { useEffect, useState } from "react";
import axios from "../requestHandler";
export default function useAppointmentsHook(uuid) {
  const [trackingHistory, setTrackingHistory] = useState([]);

  useEffect(() => {
    async function trackingHistory() {
      const request = await axios.get(`/api/v1/client/tracking/${uuid}`);
      setTrackingHistory(request.data.appointments);
    }
    trackingHistory();
  }, []);

  return [trackingHistory];
}
