import Container from "react-bootstrap/esm/Container";
import Modal from "react-bootstrap/Modal";
import useClinicians from "../functions/useClincians";
import useCommunity from "../functions/useCommunity";
import useAppointment from "../functions/useAppointments";
import Tabs from "react-bootstrap/esm/Tabs";
import Tab from "react-bootstrap/esm/Tab";
import PendingAppointments from "./pending";
import useAppointmentsToday from "../functions/useAppointmentsToday";
import useCreated from "../functions/useCreated";
import FilterableTable from "react-filterable-table";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import AppointmentForm from "../Forms/appointment";
import React from "react";
import Swal from "sweetalert2";
import API_REQUEST from "../../requestHandler";
const Scheduled = () => {
  const [appointmentTypes, setAppointmentTypes] = useAppointment();
  const [appointmentModal, setAppointmentModal] = React.useState(false);
  const [clinicians, setClinicians] = useClinicians();
  const [community, setCommunity] = useCommunity();
  // const [key, setKey] = React.useState("facility");
  // const [firstName, setFirstName] = React.useState(props.fname);
  // const [lastName, setLastName] = React.useState(props.lname);
  const [appointmentType, setAppointmentType] = React.useState("empty");
  const [timeBooked, setTimeBooked] = React.useState("empty");
  const [dateBooked, setDateBooked] = React.useState("empty");
  const [clinicianAssigned, setClinicianAssigned] = React.useState("empty");
  const [communityAssigned, setCommunityAssigned] = React.useState("empty");
  const [updateContact, setUpdateContact] = React.useState("empty");
  const [comments, setComments] = React.useState("empty");
  const [appointmentCreatedSuccessfully, setAppointmentCreatedSuccessfully] =
    React.useState(false);
  const [key, setKey] = React.useState("expected");
  const [createdToday, setCreatedToday] = useCreated();
  const [appointmentDate, setAppointmentDate] = React.useState("null");
  const [appointments, setAppointments] = useAppointmentsToday(appointmentDate);
  const [appointmentForm, setAppointmentForm] = React.useState(false);
  const [firstName, setFirstName] = React.useState();
  const [lastName, setLastName] = React.useState();
  const [uuid, setUuid] = React.useState();
  const [nupn, setNupn] = React.useState();
  //create
  const appointmentHandler = async () => {
    const hmis = sessionStorage.getItem("hmis");
    const request = await API_REQUEST.get(
      `/api/v1/create/appointment/${uuid}/${appointmentType}/${timeBooked}/${dateBooked}/${clinicianAssigned}/${communityAssigned}/${comments}/${updateContact}/${hmis}`
    );
    // addItems();
    if (request.data.status === 200) {
      Swal.fire({
        title: "Success",
        text: request.data.message,
        icon: "success",
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });

      //remove from list
      removeItem(uuid);
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

  //
  const removeItem = () => {
    var ind = appointments.findIndex(function (element) {
      return element.uuid === uuid;
    });
    if (ind !== -1) {
      appointments.splice(ind, 1);
    }
  };
  //add data to array
  // const addItems = () => {
  //   appointments.push([{ SN: "111", Art_Number: "000" }]);
  // };
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
    {
      name: "Art Number",
      displayName: "Art Number",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Unique ID",
      displayName: "Unique ID",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "First Name",
      displayName: "First Name",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Last Name",
      displayName: "Last Name",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Age/Sex",
      displayName: "Age/Sex",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Next Visit",
      displayName: "Next Visit",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    { name: "", displayName: "", render: createdBtn },
  ];

  const CreateButton = (props) => {
    return (
      <>
        <Button
          variant="outline-primary"
          className="btn-sm "
          onClick={() => {
            setAppointmentModal(true);
            setFirstName(props.record.First_Name);
            setLastName(props.record.Last_Name);
            setUuid(props.record.uuid);
            setNupn(props.record.Unique_ID);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="text-primary bi bi-plus-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
          </svg>
          {"  "}
          Book Appointment
        </Button>
      </>
    );
  };
  const Scheduled = [
    { name: "SN", displayName: "SN", inputFilterable: true },
    {
      name: "Art_Number",
      displayName: "Art Number",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Unique_ID",
      displayName: "Unique_ID",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "First_Name",
      displayName: "First Name",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Last_Name",
      displayName: "Last Name",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Age/Sex",
      displayName: "Age/Sex",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Last_Visit",
      displayName: "Visited On",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Appointment Type",
      displayName: "Appointment Type",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Reminded",
      displayName: "Reminded",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    { name: "", displayName: "", render: CreateButton },
  ];

  return (
    <>
      <Container>
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
              fields={Scheduled}
              pageSize={8}
              pageSizes={false}
              topPagerVisible={false}
            />
            <AppointmentForm
              fname={firstName}
              lname={lastName}
              nupn={nupn}
              uuid={uuid}
              status={appointmentForm}
            />
          </Tab>
          <Tab title="Appointments Created Today" eventKey="today">
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
          <Tab
            eventKey="pending"
            title={
              <>
                <span className="text-danger">DO NOT TRACK</span>
              </>
            }
          >
            <PendingAppointments />
          </Tab>
        </Tabs>
      </Container>
      {/* appointment Form */}
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
              appointmentHandler();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Scheduled;
