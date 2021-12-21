import React from "react";
import {useEffect} from "react";
import axios from "../../requestHandler";

const useAppointment = () => { // const hmis = sessionStorage.getItem("hmis");
    const [appointmentType, setAppointmentType] = React.useState([]);
    useEffect(() => {
        async function getAppointments() {
            const request = await axios.get("/api/v1/facility/appointments");
            setAppointmentType(request.data.appointments);
        }
        getAppointments();
    }, []);
    return [appointmentType];
};
export default useAppointment;
