import React from "react";
import axios from "../../requestHandler";
import { useEffect } from "react";
import Notiflix from "notiflix";

const useMissedAppointments = (appointmentDate) => {
  // Notiflix.Loading.circle("Loading");
  const [appointments, setAppointments] = React.useState([]);
  const hmis = sessionStorage.getItem("hmis");
  const departmentID = sessionStorage.getItem("department");
  useEffect(() => {
    async function getAppointments() {
      if (sessionStorage.getItem("department") === "1") {
        const request = await axios.get(
          `api/v1/facility/appointment/list/${appointmentDate}/${hmis}/${departmentID}`
        );
        setAppointments(request.data.list);
      } else if (sessionStorage.getItem("department") === "2") {
        const request = await axios.get(
          `api/v1/facility/appointment/emtct/${appointmentDate}/${hmis}/${departmentID}`
        );
        setAppointments(request.data.list);
      }

      Notiflix.Loading.remove();
    }

    //get the list of appointments
    getAppointments();
  }, [appointmentDate]);

  return [appointments];
};
export default useMissedAppointments;
