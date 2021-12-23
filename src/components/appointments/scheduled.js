import Container from "react-bootstrap/esm/Container";
import Tabs from "react-bootstrap/esm/Tabs";
import Tab from "react-bootstrap/esm/Tab";
import Button from "react-bootstrap/Button";
import axios from "../../requestHandler";
import useAppointmentsToday from "../functions/useAppointmentsToday";
import useCreated from "../functions/useCreated";
import FilterableTable from "react-filterable-table";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
var React = require("react");
// import useClinicians from "../functions/useClinician";
// import useCommunity from "../functions/useCommunity";
const Scheduled = () => {
  const [key, setKey] = React.useState("expected");
  const [createdToday, setCreatedToday] = useCreated([]);

  const [appointmentDate, setAppointmentDate] = React.useState("null");
  const [appointments, setAppointments] = useAppointmentsToday(appointmentDate);

  //creted tp day

  const [] = React.useState([]);

  const createdBtn = (props) => {
    return (
      <>
        {/* <Button variant="outline-primary" className="btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-fill"
            viewBox="0 0 16 16"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
          </svg>
          {"  "}
          Edit Appointment
        </Button> */}
      </>
    );
  };

  //emtct fields for

  const createFields = [
    { name: "SN", displayName: "SN", inputFilterable: true },
    { name: "Art Number", displayName: "Art Number", inputFilterable: true },
    { name: "Unique ID", displayName: "Unique ID", inputFilterable: true },
    { name: "First Name", displayName: "First Name", inputFilterable: true },
    { name: "Last Name", displayName: "Last Name", inputFilterable: true },
    { name: "Age/Sex", displayName: "Age/Sex", inputFilterable: true },
    { name: "Next Visit", displayName: "Next Visit", inputFilterable: true },
    { name: "", displayName: "", render: createdBtn },
  ];

  return (
    <>
      <Container style={{ height: "540px" }}>
        <h5 className="h5 component">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="text-primary bi bi-grid-3x3-gap-fill"
            viewBox="0 0 16 16"
          >
            <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z" />
          </svg>
          {"  "}
          Manage Appointments
        </h5>
        <Tabs
          onSelect={(k) => {
            setKey(k);
          }}
          activeKey={key}
        >
          <Tab title="Appointment" eventKey="expected">
            <h5 className="component h6" style={{ fontSize: "bold" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-people-fill"
                viewBox="0 0 16 16"
              >
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                <path d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
              </svg>
              {"   "}
              Expected on
              <span style={{ fontWeight: 400 }}>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-caret-right-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                </svg>{" "}
                {appointmentDate}
              </span>{" "}
              <FormControl
                onChange={(e) => {
                  setAppointmentDate(e.target.value);
                }}
                type="date"
                style={{ width: "280px", Padding: "10px" }}
                className="float-end form-control-sm"
              />
              {/* <Button className="btn-sm float-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="text-white bi bi-printer-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z" />
                  <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                </svg>{" "}
                Print List
              </Button> */}
            </h5>
            <FilterableTable
              data={appointments}
              pageSize={8}
              pageSizes={false}
              topPagerVisible={false}
            />
          </Tab>
          <Tab title="Appointment Created Today" eventKey="today">
            <h5 className="component h6" style={{ fontSize: "bold" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil-fill"
                viewBox="0 0 16 16"
              >
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
              </svg>
              {"  "}Created Today
            </h5>
            <FilterableTable
              className="table-bordered"
              data={createdToday}
              fields={createFields}
              pageSize={8}
              pageSizes={false}
              topPagerVisible={false}
            />
          </Tab>
        </Tabs>
      </Container>
      {/* <Modal show={true} dialogClassName="modal-lg">
        <Modal.Header></Modal.Header>
        <Modal.Body>
          {" "}
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
                    <option value={row.id}>{row.appointment_name}</option>
                  ))}
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
                    <option value={row.id}>
                      {row.first_name} {row.last_name}
                    </option>
                  ))}
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
                    <option value={row.id}>
                      {row.first_name} {row.last_name}
                    </option>
                  ))}
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
      </Modal> */}
    </>
  );
};

export default Scheduled;
