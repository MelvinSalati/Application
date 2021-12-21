import React from "react";
import FilterableTable from "react-filterable-table";

const ClientAppointments = (props) => {
  const [appointments, setAppointments] = React.useState(
    props.data.appointments
  );
  return (
    <>
      <FilterableTable data={appointments} />
    </>
  );
};
export default ClientAppointments;
