import React from "react";
import { useEffect } from "react";
import FilterableTable from "react-filterable-table";
import useMissedAppointment from "../functions/useMissedAppointment";
import FormControl from "react-bootstrap/FormControl";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Badge from "react-bootstrap/esm/Badge";
import axios from "../../requestHandler";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

const MissedAppointments = () => {
  const [appointmentsList, setAppointmentsList] = React.useState([]);
  const hmis = sessionStorage.getItem("hmis");
  const [reset, setReset] = React.useState([]);
  const [recipientUuid, setRecipientUuid] = React.useState("");
  const [viewTrackingHistoryModal, setViewTrackingHistoryModal] =
    React.useState(false);
  // tracking form
  const [trackingDate, setTrackingDate] = React.useState("null");
  const [trackingTime, setTrackingTime] = React.useState("null");
  const [trackingActivity, setTrackingActivity] = React.useState("null");
  const [trackingResponse, setTrackingResponse] = React.useState("null");
  const [trackingOutcome, setTrackingOutcome] = React.useState("null");
  const [trackingComment, setTrackingComment] = React.useState("null");
  const [viewTrackingForm, setViewTrackingForm] = React.useState(false);
  const [appointmentID, setAppointmentID] = React.useState("null");
  const [trackingHx, setTrackingHx] = React.useState([]);
  const [isClientWithDrugs, setClientsWithDrugs] = React.useState("null");
  //count missed appointments for
  const [week1, setWeek1] = React.useState("..");
  const [week2, setWeek2] = React.useState("..");
  const [week3, setWeek3] = React.useState("..");
  const [week4, setWeek4] = React.useState("..");
  //tracking button

  const btnTracking = async () => {
    const request = await axios.get(
      `/api/v1/facility/tracking/form/${isClientWithDrugs}/${trackingDate}/${trackingTime}/${trackingActivity}/${trackingResponse}/${trackingOutcome}/${trackingComment}/${appointmentID}/${recipientUuid}`
    );
    if (request.data.status === 200) {
      Swal.fire({
        title: "Success",
        text: request.data.message,
        icon: "success",
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    } else if (request.data.status === 401) {
      Swal.fire({
        title: "Error",
        text: request.data.message,
        icon: "error",
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    }
  };

  const [daysMissed, setDaysMissed] = React.useState(1);

  useEffect(() => {
    async function getTrackingHistory() {
      setTrackingHx([]);
      const request = await axios.get(
        `api/v1/facility/tracking/${recipientUuid}/${appointmentID}`
      );
      setTrackingHx(request.data.appointments);
    }
    getTrackingHistory();
  }, [recipientUuid, appointmentID]);

  useEffect(() => {
    async function getMissedAppointments() {
      const request = await axios.get(
        `api/v1/facility/appointments/missed/${hmis}/${daysMissed}`
      );
      setAppointmentsList(request.data.appointments);
      setWeek1(request.data.appointments.length);
    }
    getMissedAppointments();
  }, [daysMissed]);

  useEffect(() => {
    async function countAppointments() {
      const request = await axios.get(`count/missed/${hmis}`);

      setWeek4(request.data.week_four);
      setWeek3(request.data.week_three);
      setWeek2(request.data.week_two);
      setWeek1(request.data.week_one);
    }
    countAppointments();
  }, [week1, week2, week3, week4]);

  const tableBtns = (props) => {
    return (
      <>
        <ButtonGroup className="btn-sm">
          <Button
            className="btn-sm"
            onClick={() => {
              setRecipientUuid(props.record.uuid);
              setAppointmentID(props.record.id);
              setViewTrackingHistoryModal(true);
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
            {"  "}View
          </Button>
          <Button
            className="btn-sm"
            variant="outline-primary"
            onClick={() => {
              setRecipientUuid(props.record.uuid);
              setViewTrackingForm(true);
              setAppointmentID(props.record.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="text-primary bi bi-pencil-fill"
              viewBox="0 0 16 16"
            >
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg>
            {"   "}
            Enter Activity
          </Button>
        </ButtonGroup>
      </>
    );
  };

  const tableFields = [
    {
      name: "SN",
      displayName: "SN",
      inputInfilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "art",
      displayName: "Art Number",
      inputInfilterable: true,
      exactFilterable: true,
      sortable: true,
    },

    {
      name: "nupn",
      displayName: "Unique ID",
      inputInfilterable: true,
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
      name: "Phone",
      displayName: "Phone",
      inputInfilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Days Missed",
      displayName: "Days Missed",
      inputInfilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Date Declared Late",
      displayName: "Days Declared Late",
      inputInfilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "",
      displayName: "",
      render: tableBtns,
    },
  ];

  return (
    <>
      <Container style={{ height: "540px" }}>
        <h5 className="component">
          <i className="fas fa-user-md"></i> {"  "} Appointment missed
          <ButtonGroup className="btn-sm float-end">
            <Button
              onClick={() => {
                setDaysMissed(1);
              }}
              variant="outline-success"
              className="btn-sm"
            >
              1 week{" "}
              <Badge as="span" text="white" pill={true} bg="success">
                {week1}
              </Badge>
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                setDaysMissed(2);
              }}
              className="btn-sm"
            >
              2 week{" "}
              <Badge as="span" pill={true} bg="primary" text="white">
                {week2}
              </Badge>
            </Button>

            <Button
              onClick={() => {
                setDaysMissed(3);
              }}
              variant="outline-warning"
              className="btn-sm"
            >
              3 week{" "}
              <Badge pill={true} bg="warning" text="white">
                {week3}
              </Badge>
            </Button>

            <Button
              onClick={() => {
                setDaysMissed(4);
              }}
              className="btn-sm"
              variant="outline-danger"
            >
              4 weeks
              {"  "}
              <Badge pill={true} bg="danger" text="white">
                {week4}
              </Badge>
            </Button>
          </ButtonGroup>
        </h5>
        <Container style={{ height: "550px" }}>
          <FilterableTable
            data={appointmentsList}
            fields={tableFields}
            pageSize={8}
            pageSizes={false}
            topPagerVisible={false}
            sortable={true}
          />
        </Container>
        <Modal
          show={viewTrackingHistoryModal}
          onHide={() => {
            setViewTrackingHistoryModal(false);
          }}
          dialogClassName="modal-lg"
        >
          <Modal.Header closeButton>
            <h5 className="text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              {"   "}
              Tracking History
            </h5>
          </Modal.Header>
          <Modal.Body className="bg-light">
            <FilterableTable
              data={trackingHx}
              topPagerVisible={false}
              pageSize={6}
              pageSizes={false}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setViewTrackingHistoryModal(false);
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        {/* enter tracking data */}
        <Modal
          show={viewTrackingForm}
          onHide={() => {
            setViewTrackingForm(false);
          }}
          dialogClassName="modal-lg"
        >
          <Modal.Header closeButton>
            <h5 className="text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              {"   "}
              Record Tracking Intervention
            </h5>
          </Modal.Header>
          <Modal.Body className="bg-light">
            <div className="row">
              <div className="col-md-6">
                <label>Next Appointment Date</label>
                <FormControl
                  onChange={(e) => {
                    setTrackingDate(e.target.value);
                  }}
                  type="date"
                  placeholder="Date"
                />
              </div>
              <div className="col-md-6">
                <label>Time</label>
                <FormControl
                  onChange={(e) => {
                    setTrackingTime(e.target.value);
                  }}
                  type="time"
                  placeholder="Date"
                />
              </div>
              <div className="col-md-12">
                <label>Tracking actviaty</label>
                <select
                  onChange={(e) => {
                    setTrackingActivity(e.target.value);
                  }}
                  className="form-control"
                >
                  <optgroup label="Tracking activity">
                    <option>Select tracking activity</option>
                    <option value="1">Phone Call</option>
                    <option value="2">Home Visit</option>
                    <option value="3">Other</option>
                  </optgroup>
                </select>
              </div>
              <div className="col-md-6">
                <br />
                <label>Tracking Response</label>
                <select
                  onChange={(e) => {
                    setTrackingResponse(e.target.value);
                  }}
                  className="form-control"
                >
                  <optgroup label="Responses">
                    <option value="0">Select response</option>
                    <option value="1">Picked drugs elsewhere (Clinic)</option>
                    <option value="2">Self transfer</option>
                    <option value="3">Admitted to Hospital</option>
                    <option value="4">Refused treatment</option>
                    <option value="5">Phone off</option>
                    <option value="6">Phone unreachable</option>
                    <option value="7">Client has drugs</option>
                    <option value="8">Got drugs from freind</option>
                  </optgroup>
                </select>
              </div>
              <div className="col-md-6">
                <br />
                <label>Tracking Outcome</label>
                <select
                  onChange={(e) => {
                    setTrackingOutcome(e.target.value);
                  }}
                  className="form-control"
                >
                  <optgroup label="Responses">
                    <option value="0">Select outcome</option>
                    <option value="1">True lost to follow up</option>
                    <option value="2">Reported death</option>
                  </optgroup>
                </select>
              </div>
              <div className="col-md-12">
                {trackingResponse === "7" ? (
                  <>
                    <label>Resign Appointment Date</label>
                    <br />
                    <FormControl
                      type="date"
                      onChange={(e) => {
                        setClientsWithDrugs(e.target.value);
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="col-md-12">
                <br />
                <label>Comment</label>
                <FormControl
                  onChange={(e) => {
                    setTrackingComment(e.target.value);
                  }}
                  as="textarea"
                  row={6}
                  placeholder="Comment"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                btnTracking();
                setViewTrackingForm(false);
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};
export default MissedAppointments;
