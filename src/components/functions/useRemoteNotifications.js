import axios from "../../requestHandler";
import { useEffect, useState } from "react";

const useRemoteNotifications = () => {
  const [remoteNotifications, setRemoteNotifications] = useState([]);
  const hmis = sessionStorage.getItem("hmis");

  useEffect(() => {
    async function notifications() {
      await axios
        .get(`api/v1/notifications/show/${hmis}`)
        .then((response) => {
          setRemoteNotifications(response.data.notifications);
          console.log("response--" + response.data.notifications);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    notifications();
  }, [hmis]);

  return remoteNotifications;
};
export default useRemoteNotifications;
