import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import FormControl from "react-bootstrap/FormControl";
import useClinicians from "../functions/useClincians";
import useCommunity from "../functions/useCommunity";
import useAppointment from "../functions/useAppointments";
import Button from "react-bootstrap/Button";
import API_REQUEST from "../../requestHandler";
import Swal from "sweetalert2";
const AppointmentForm = (props) => {
  const [appointmentTypes, setAppointmentTypes] = useAppointment();
  const [appointmentModal, setAppointmentModal] = React.useState(false);
  const [clinicians, setClinicians] = useClinicians();
  const [community, setCommunity] = useCommunity();
  const [key, setKey] = React.useState("facility");
  const [firstName, setFirstName] = React.useState(props.fname);
  const [clientUuid, setClientUuid] = React.useState(props.uuid);
  const [lastName, setLastName] = React.useState(props.lname);
  const [appointmentType, setAppointmentType] = React.useState("empty");
  const [timeBooked, setTimeBooked] = React.useState("empty");
  const [dateBooked, setDateBooked] = React.useState("empty");
  const [clinicianAssigned, setClinicianAssigned] = React.useState("empty");
  const [communityAssigned, setCommunityAssigned] = React.useState("empty");
  const [updateContact, setUpdateContact] = React.useState("empty");
  const [comments, setComments] = React.useState("empty");
  const [appointmentCreatedSuccessfully, setAppointmentCreatedSuccessfully] =
    React.useState(false);
  const form = props.status;

  //form
  const bookAppointment = async () => {
    const hmis = sessionStorage.getItem("hmis");
    const request = await API_REQUEST.get(
      `/api/v1/create/appointment/${clientUuid}/${appointmentType}/${timeBooked}/${dateBooked}/${clinicianAssigned}/${communityAssigned}/${comments}/${updateContact}/${hmis}`
    );

    if (request.data.status === 200) {
      Swal.fire({
        title: "Success",
        text: request.data.message,
        icon: "success",
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
      setAppointmentModal(false);
    } else if (request.data.status === 401) {
      Swal.fire({
        title: "Error",
        text: request.data.message,
        icon: "error",
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
      setAppointmentModal(false);
    }
  };
  useEffect(() => {
    if (props.status === true) {
      setAppointmentModal(true);
    } else if (props.status === false) {
      setAppointmentModal(false);
    }
  }, [form]);
  return (
    <>
      {appointmentCreatedSuccessfully ? (
        <></>
      ) : (
        <>
          {" "}
          {/* modal appointments */}
          <Modal
            show={appointmentModal}
            onHide={() => {
              setAppointmentModal(false);
            }}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton className="bg-white">
              <h6 className="modal-title text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-plus-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                {"  "}Book Appointment
              </h6>
            </Modal.Header>
            <Modal.Body className="bg-light">
              <div className="row">
                <div className="col-md-6">
                  <select
                    onChange={(e) => {
                      setAppointmentType(e.target.value);
                    }}
                    className="form-control"
                  >
                    <optgroup label="Appointments">
                      <option value="0">Select Appointments</option>
                      {appointmentTypes.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.appointment_name}
                        </option>
                      ))}{" "}
                    </optgroup>
                  </select>
                </div>
                <div className="col-md-6">
                  <FormControl
                    min="07:00"
                    max="17:00"
                    onChange={(e) => {
                      setTimeBooked(e.target.value);
                    }}
                    type="time"
                  />
                  <br />
                </div>
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <FormControl
                    onChange={(e) => {
                      setDateBooked(e.target.value);
                    }}
                    type="date"
                  />
                  <br />
                </div>
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <select
                    onChange={(e) => {
                      setClinicianAssigned(e.target.value);
                    }}
                    className="form-control"
                  >
                    <optgroup label="Assign  Clinicians">
                      <option value="">Select Clinician</option>
                      {clinicians.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.first_name}
                          {row.last_name}{" "}
                        </option>
                      ))}{" "}
                    </optgroup>
                  </select>
                  <br />
                </div>
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <select
                    onChange={(e) => {
                      setCommunityAssigned(e.target.value);
                    }}
                    className="form-control"
                  >
                    <optgroup label="Assign  Clinicians">
                      <option value="">Select Community volunteer</option>
                      {community.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.first_name}
                          {row.last_name}{" "}
                        </option>
                      ))}{" "}
                    </optgroup>
                  </select>
                  <br />
                </div>
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <FormControl
                    onChange={(e) => {
                      setUpdateContact(e.target.value);
                    }}
                    type="text"
                    placeholder="Update phone number"
                  />
                  <br />
                </div>
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <FormControl
                    onChange={(e) => {
                      setComments(e.target.value);
                    }}
                    row={6}
                    as="textarea"
                    type="text"
                    placeholder="Commments"
                  />
                  <br />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  bookAppointment();
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};
export default AppointmentForm;
