import { useEffect, useState } from "react";
import React from "react";
import { FilterableTable } from "react-filterable-table";
import axios from "../../requestHandler";
import { Container, Button } from "react-bootstrap";

export default function Appointments(props) {
  const [appointments, setAppointments] = useState([]);
  const [appointmentModal, setAppointmentModal] = useState(false);
  // client appointments table
  const clientsTableFields = [
    {
      name: "sn",
      displayName: "Sn",
    },
    {
      name: "appointment_type",
      displayName: "Appointment Type",
    },
    {
      name: "due_date",
      displayName: "Next Appointment",
    },
    {
      name: "time_booked",
      displayName: "Time Booked",
    },
    {
      name: "created_at",
      displayName: "Created At",
    },
    {
      name: "status",
      displayName: "Status",
    },
  ];
  return (
    <>
      <Container style={{ position: "relative" }}>
        <h5>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            className="text-primary bi bi-list-task"
            viewBox="0 0 16 16"
          >
            <path d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z" />
            <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z" />
            <path d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z" />
          </svg>{" "}
          {"  "}
          Appointment List
          <Button
            variant="primary"
            className="btn-sm float-end"
            style={{ borderRadius: "25px" }}
            onClick={() => {
              setAppointmentModal(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="text-white bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            {"   "}
            Book Appointment
          </Button>
        </h5>
        <hr />
        <FilterableTable
          data={appointments}
          fields={clientsTableFields}
          topPagerVisible={false}
          pageSize={6}
          pageSizes={false}
        />
      </Container>
    </>
  );
}
