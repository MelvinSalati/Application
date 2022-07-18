import axios from "react";
import { useEffect } from "react";
const usePendingAppointments = () => {
  useEffect(() => {
    async function sendReminders() {
      const request = await axios
        .post("broadcaster.v1.smart-umodzi.com/public/notification/missed", {
          hmis: sessionStorage.getItem("hmis"),
        })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    }
    sendReminders();
  }, []);
  return [];
};
export default usePendingAppointments;
