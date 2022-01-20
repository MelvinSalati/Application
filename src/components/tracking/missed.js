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

  const btnTracking = async () => {
    const request = await axios.get(
      `/api/v1/facility/tracking/form/${trackingDate}/${trackingTime}/${trackingActivity}/${trackingResponse}/${trackingOutcome}/${trackingComment}/${appointmentID}/${recipientUuid}`
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

  // missed one week
  const missedOneWeek = async () => {
    setAppointmentsList(reset);
    const request = await axios.get(
      `api/v1/facility/appointments/missed/${hmis}/1`
    );
    setAppointmentsList(request.data.appointments);
  };
  // missed two week
  const missedTwoWeek = async () => {
    setAppointmentsList(reset);

    const request = await axios.get(
      `api/v1/facility/appointments/missed/two/${hmis}`
    );
    setAppointmentsList(request.data.appointments);
  };
  // missed 3 week
  const missedThreeWeek = async () => {
    const request = await axios.get(
      `api/v1/facility/appointments/missed/three/${hmis}`
    );
    setAppointmentsList(request.data.appointments);
  };
  // missed one week
  const missedFourWeek = async () => {
    setAppointmentsList(reset);

    const request = await axios.get(
      `api/v1/facility/appointments/missed/four/${hmis}`
    );
    setAppointmentsList(request.data.appointments);
  };

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
        `api/v1/facility/appointments/missed/${hmis}/1`
      );
      setAppointmentsList(request.data.appointments);
    }

    getMissedAppointments();
  }, []);

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
    },
    {
      name: "art",
      displayName: "Art Number",
      inputInfilterable: true,
    },
    {
      name: "nupn",
      displayName: "Unique ID",
      inputInfilterable: true,
    },
    {
      name: "First Name",
      displayName: "First Name",
      inputInfilterable: true,
    },
    {
      name: "Last Name",
      displayName: "Last Name",
      inputInfilterable: true,
    },
    {
      name: "Phone",
      displayName: "Phone",
      inputInfilterable: true,
    },
    {
      name: "Days Missed",
      displayName: "Days Missed",
      inputInfilterable: true,
    },
    {
      name: "Date Declared Late",
      displayName: "Days Declared Late",
      inputInfilterable: true,
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
          {/* <ButtonGroup className="btn-sm float-end">
                    <Button onClick={
                            () => {
                                missedOneWeek();
                            }
                        }
                        variant="outline-primary"
                        className="btn-sm">
                        1 week
                    </Button>
                    <Button onClick={
                            () => {
                                missedTwoWeek();
                            }
                        }
                        className="btn-sm">
                        2 week
                    </Button>

                    <Button onClick={
                            () => {
                                missedThreeWeek();
                            }
                        }
                        variant="outline-primary"
                        className="btn-sm">
                        3 week
                    </Button>

                    <Button onClick={
                            () => {
                                missedFourWeek();
                            }
                        }
                        className="btn-sm">
                        4 weeks
                    </Button>
                </ButtonGroup> */}
        </h5>
        <Container style={{ height: "550px" }}>
          <FilterableTable
            data={appointmentsList}
            fields={tableFields}
            pageSize={6}
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
            <h5>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              {"   "}
              Enter Tracking Intervention
            </h5>
          </Modal.Header>
          <Modal.Body className="bg-light">
            <div className="row">
              <div className="col-md-6">
                <FormControl
                  onChange={(e) => {
                    setTrackingDate(e.target.value);
                  }}
                  type="date"
                  placeholder="Date"
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  onChange={(e) => {
                    setTrackingTime(e.target.value);
                  }}
                  type="time"
                  placeholder="Date"
                />
              </div>
              <div className="col-md-12">
                <br />
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
                <br />

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
