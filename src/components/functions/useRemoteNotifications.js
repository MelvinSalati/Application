import React from "react";
import axios from "../../requestHandler";
import { useEffect } from "react";

const useRemoteNotifications = (appointmentDate) => {
  const [notifications, setNotifications] = React.useState([]);
  const [fakeCurrentDate, setFakeCurrentDate] = React.useState(new Date());
  const hmis = sessionStorage.getItem("hmis");
  useEffect(() => {
    setTimeout(() => setFakeCurrentDate(new Date()), 120000);
    async function getNotifications() {
      const request = await axios.get(
        `api/v1/facility/notifications/new/${hmis}`
      );
      setNotifications(request.data.notifications);
    }

    //get the list of appointments
    getNotifications();

    // return () => {
    //   setFakeCurrentDate(false)
    //   console.log('false')
    // }
  }, [fakeCurrentDate]);

  return [notifications];
};
export default useRemoteNotifications;
