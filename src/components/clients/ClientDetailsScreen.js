import React, { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { Notify } from "notiflix/build/notiflix-notify-aio";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import axios from "../../requestHandler";
import FilterableTable from "react-filterable-table";
import Modal from "react-bootstrap/Modal";
import Avatar from "react-avatar";
// import BiometricData from
import { Container } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Swal from "sweetalert2";
import useClinicians from "../functions/useClincians";
import useCommunity from "../functions/useCommunity";
import useAppointment from "../functions/useAppointments";
import useProvince from "../functions/useProvince";
import { Form, FormLabel } from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import history from "../../history";
import useEmtctEnrolled from "../../Hooks/useEmtctEnrolled";
import useClientsDetails from "../../Hooks/useClientsDetails";
import DetailsScreen from "./DetailsScreen";
import Appointments from "./Appointments";
import useAppointmentsHook from "../../Hooks/useAppointmentsHooks";
import useTrackingHook from "../../Hooks/useTrackingHook";
import NavbarScreen from "../navbar/navbar";

export default function ClientDetailsScreen(props) {
  // load
  // Notiflix.Loading.circle("Retrieving data..");

  // get appointment using uuid
  // custom Hook useAppointmentsHook
  const [appointments] = useAppointmentsHook(props.location.state.details.Uuid);
  const emtctEnrolled = useEmtctEnrolled(props.location.state.details.Uuid);
  const [clinicians] = useClinicians();
  const [community] = useCommunity();

  const data = props.location.state.details;
  const hmis = data.hmis;
  const name = data.name;
  const nupn = data.patient_nupn;
  const art = data.art_number;
  const fac_phone = data.phone;
  //   transfer mdal btn
  // create appointment

  const [appointmentType, setAppointmentType] = React.useState("empty");
  const [timeBooked, setTimeBooked] = React.useState("empty");
  const [dateBooked, setDateBooked] = React.useState("empty");
  const [clinicianAssigned, setClinicianAssigned] = React.useState("empty");
  const [communityAssigned, setCommunityAssigned] = React.useState("empty");
  const [updateContact, setUpdateContact] = React.useState("empty");
  const [comments, setComments] = React.useState("empty");
  // selected client id
  const [transferModal, setTransferModal] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [appointmentTypes, setAppointmentTypes] = useAppointment();
  const [isPVLS, setIsPVLS] = React.useState("");
  // add baby
  const [chID, setChID] = React.useState("null");
  const [fname, setFname] = React.useState("null");
  const [lname, setLname] = React.useState("null");
  const [sex, setSex] = React.useState("null");
  const [dob, setDob] = React.useState("null");
  const [mVLS, setMVLS] = useState(false);
  const [infantType, setInfantType] = useState("");

  const [
    createBabyAppointmentModal,
    setCreateBabyAppointmentModal,
  ] = React.useState(false);
  const [entryLevel, setEntryLevel] = React.useState("0");
  const [viewDeaths, setViewDeaths] = React.useState([]);
  const [viewContacts, setViewContacts] = React.useState([]);
  const [babyID, setBabyID] = React.useState("");
  const [
    viewBabyAppointmentModal,
    setViewBabyAppointmentModal,
  ] = React.useState(false);
  const [addBabyModal, setAddBabyModal] = React.useState(false);
  const [babies, setBabies] = React.useState([]);
  const [inEmtctModal, setInEmtctModal] = React.useState(false);
  const [contactId, setContactId] = React.useState("null");
  const [contactModal, setContactModal] = React.useState(false);
  const [componentName, setComponentName] = React.useState("charts");
  const [deathModal, setDeathModal] = React.useState(false);
  const [statusCode, setStatusCode] = React.useState("");
  const [missedAppointments] = useTrackingHook(
    props.location.state.details.Uuid
  );

  useEffect(() => {
    // baby appointments
    async function getEmtct() {
      const request = await axios.get(`/api/v1/client/baby/${uuid}`);
      if (request.data.status === 200) {
        setBabies(request.data.show);
      } else {
        setBabies([]);
      }
    }

    // contact list status
    async function getContacts() {
      const request = await axios.get(`/api/v1/client/contacts/${uuid}`);
      setViewContacts(request.data.contacts);
    }
    async function getDeath() {
      const request = await axios.get(`/api/v1/client/death/${uuid}`);
      setViewDeaths(request.data.death);
    }
    getEmtct();
    getContacts();
    getDeath();
  }, []);

  // Download  patient Appointment card
  const downloadCardHandler = () => {
    const name = data.firstname + "   " + data.lastname;
    const fac = sessionStorage.getItem("name");
    const hmis = sessionStorage.getItem("hmis");
    window.open(
      `https://card.v2.smart-umodzi.com?hmis=${hmis}&name=${name}&nupn=${nupn}&art=${art}&fac=${fac}&fac_ph=${fac_phone}`
    );
  };

  //   contacts fields
  const deletedBtn = async () => {
    await axios
      .get(`/api/v1/client/contact/delete/${contactId}`)
      .then((response) => {
        if (response.data.status === 200) {
          Notify.success(response.data.message);
        }
      });
  };
  const contactStatus = (props) => {
    return (
      <>
        {" "}
        {props.record.status === "1" ? (
          <>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="text-success bi bi-check-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
              Confirmed
            </span>
          </>
        ) : (
          <>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="text-danger bi bi-x-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
              </svg>
              not confirmed
            </span>
          </>
        )}{" "}
      </>
    );
  };
  // contacts button
  const contactBtns = (props) => {
    return (
      <>
        <ButtonGroup className="btn-sm">
          {/* <Button
            onClick={(e) => {
              setContactId(props.record.id);
            }}
            variant="outline-primary"
            className="btn-sm"
          >
            Update
          </Button> */}
          <Button
            onClick={(e) => {
              setContactId(props.record.id);
              deletedBtn();
            }}
            variant="danger"
            className="btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="text-white bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
            </svg>
            {"  "}Delete
          </Button>
        </ButtonGroup>
      </>
    );
  };
  const contactFields = [
    {
      name: "SN",
      displayName: "SN",
      inputFilterable: true,
    },
    {
      name: "First Name",
      displayName: "First Name",
      inputFilterable: true,
    },
    {
      name: "Last Name",
      displayName: "Last Name",
      inputFilterable: true,
    },
    {
      name: "Phone Number",
      displayName: "Phone Number",
      inputFilterable: true,
    },
    {
      name: "Address",
      displayName: "Address",
      inputFilterable: true,
    },
    {
      name: "status",
      displayName: "Status",
      inputFilterable: true,
      render: contactStatus,
    },
    {
      name: "",
      displayName: "",
      render: contactBtns,
    },
  ];

  //   baby babies table
  const emtctBtns = (props) => {
    return (
      <>
        <ButtonGroup className="btn-sm" style={{ borderRadius: "25px" }}>
          <Button
            onClick={() => {
              setViewBabyAppointmentModal(true);
              setBabyID(props.record.babyid);
            }}
            variant="outline-primary"
            className="btn-sm"
          >
            View
          </Button>
          <Button
            onClick={() => {
              setBabyID(props.record.babyid);
              setCreateBabyAppointmentModal(true);
            }}
            variant="primary"
            className="btn-sm border-0"
          >
            Book Appointment
          </Button>
          <Button variant="outline-primary">EID Report</Button>
        </ButtonGroup>
      </>
    );
  };
  const emtctFields = [
    {
      name: "SN",
      displayName: "SN",
      inputFilterable: true,
    },
    {
      name: "First Name",
      displayName: "First Name",
      inputFilterable: true,
    },
    {
      name: "Last  Name",
      displayName: "Last Name",
      inputFilterable: true,
    },
    {
      name: "Gender",
      displayName: "Gender/Age",
      inputFilterable: true,
    },
    {
      name: "Date Of Birth",
      displayName: "Date Of Birth",
      inputFilterable: true,
    },
    {
      name: "Date Enrolled",
      displayName: "Date Enrolled",
      inputFilterable: true,
    },
    {
      name: "",
      displayName: "",
      render: emtctBtns,
    },
  ];
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

  // get client id
  const uuid = props.location.state.details.Uuid;
  // const detail = useClientsDetails();
  // remove loading
  useEffect(() => {
    Notiflix.Loading.remove();
  }, []);

  // handlers
  // add baby
  const addBaby = async () => {
    Notify.success("Request submitted successfully!");
    const request = await axios.post(`/api/v1/client/baby/create`, {
      infanttype: infantType,
      gid: uuid,
      babyID: chID,
      fname: fname,
      lname: lname,
      gender: sex,
      dob: dob,
      mVLS: mVLS,
    });
    if (request.status === 200) {
      Notify.success("Baby added succesfully!");
    } else if (request.status === 401) {
      Notify.warning("Sorry, registration failed!");
    }
  };
  /****
   *  Add Baby
   *  @Var mother uuid
   *  @var entryLevel
   *
   *
   */

  const emtctEnrollment = async () => {
    setInEmtctModal(false);
    if (entryLevel === "0") {
      Notify.warning("Please select appropriate entry level!");
    } else {
      await axios
        .post("/api/v1/emtct/enrollment", {
          uuid: uuid,
          entry: entryLevel,
        })
        .then((response) => {
          if (response.data.status === 200) {
            Notify.success("Successfully enrolled into Emtct prgram !");
          } else if (response.data.status === 300) {
            Notify.info(
              "Mother already enrolled in EMTCT program and active !"
            );
          }
        });
    }
  };
  const isPreviousViralSuppressedHandler = (e) => setIsPVLS(e.target.value);
  //Book Appointment
  /**
   * Appointment created for none
   *  emtct patients
   *
   */
  const appointmentDetails = {
    uuid: uuid,
    appointment: appointmentType,
    time: timeBooked,
    date: dateBooked,
    clinician: clinicianAssigned,
    community: communityAssigned,
    comment: comments,
    contact: updateContact,
    code: sessionStorage.getItem("hmis"),
    department: 1,
  };
  const bookAppointment = async () => {
    Notify.success("Request submitted successfully!");
    await axios
      .post(`/api/v1/create/appointment`, appointmentDetails)
      .catch((error) => {
        Notify.warning(error.message);
      })
      .then((response) => {
        if (response.data.status === 200)
          return Notify.success("Appointment created successfully!");
      });
  };

  //  appointments  for mothers in antepartum
  const [pVLS, setPVLS] = useState("");
  const [prophylaxisArvs, setProphylaxisArvs] = useState(false);
  const [prophylaxisCtx, setProphylaxisCtx] = useState(false);
  const [treatmentArvs, setTreatmentArvs] = useState(false);
  const [DBS, setDBS] = useState(false);
  const [antibody, setAntibody] = useState("");
  const [babyTime, setBabyTime] = React.useState("");
  const [babyDate, setBabyDate] = React.useState("");
  const [babyClinician, setBabyClinician] = React.useState("");
  const [babyCommunity, setBabyCommunity] = React.useState("");
  const babyParams = {
    uuid: uuid,
    nextdate: babyDate,
    clinician: babyClinician,
    community: babyCommunity,
    babyID: babyID,
    previousvls: pVLS,
    dp: sessionStorage.getItem("department"),
    code: sessionStorage.getItem("hmis"),
    type: infantType,
    parvs: prophylaxisArvs,
    pctx: prophylaxisCtx,
    tarvs: treatmentArvs,
    dbs: DBS,
    antibody: antibody,
  };
  const createBabyAppointment = async () => {
    Notify.success("Request submitted successfully !!");
    const request = await axios.post(
      `api/v1/baby/create/appointment`,
      babyParams
    );
    if (request.status === 200) {
      Notify.success("Appointment created successfully!");
    } else if (request.data.status === 401) {
      Notify.success("Appointment not successfull!");
    }
  };
  const eMTCTAppointment = async (e) => {
    axios
      .post("/api/v1/create/Emtct", {
        uuid: uuid,
        appointment: appointmentType,
        timebooked: timeBooked,
        nextdate: dateBooked,
        clinician: clinicianAssigned,
        community: communityAssigned,
        update: updateContact,
        previousVL: isPVLS,
        dp: 2,
        code: sessionStorage.getItem("hmis"),
        state: 1,
      })
      .then((response) => {
        // close appointment modal
        setAppointmentModal(false);
        if (response.data.status === 200) {
          setAppointmentModal(false);
          Notify.success("Appointment created successfully!");
        }
        if (response.data.status === 300)
          return Notify.warning(response.data.msg);
      });
  };
  return (
    <>
      <NavbarScreen />
      {/* Navbar global ends */}
      <Container
        className="bg-white container content"
        style={{ marginTop: "4%" }}
      >
        <div className="row">
          <div className="col-md-12" style={{ paddingTop: 10 }}></div>
          <DetailsScreen uuid={uuid} />

          <div className="col-md-12">
            <Tabs>
              {/* <Tab title="Manage Biometric Data" eventKey="biodata" disabled>
                <BiometricData data={data.patient_nupn} />
              </Tab> */}
              <Tab
                title="Active Appointments"
                eventKey="app"
                disabled={
                  sessionStorage.getItem("department") === "2" ? true : false
                }
              >
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
                        Notiflix.Loading.remove();
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
              </Tab>
              <Tab title="Tracking Activities" eventKey="track">
                <Container>
                  <br />
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
                    Tracking List
                    <Button
                      variant="outline-primary"
                      className="float-end border-0"
                    >
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="text-primary bi bi-signpost-2-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7.293.707A1 1 0 0 0 7 1.414V2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v1H2.5a1 1 0 0 0-.8.4L.725 8.7a.5.5 0 0 0 0 .6l.975 1.3a1 1 0 0 0 .8.4H7v5h2v-5h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9V6h4.5a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.3 2.4a1 1 0 0 0-.8-.4H9v-.586A1 1 0 0 0 7.293.707z" />
                      </svg>
                      {"    "}
                      Track Client
                    </Button>
                  </h5>
                  <hr />
                  <FilterableTable
                    data={missedAppointments}
                    // fields={trackingFields}
                    topPagerVisible={false}
                    pageSize={6}
                    pageSizes={false}
                  />
                  <br />
                </Container>
              </Tab>
              <Tab
                title="Manage Emtct"
                eventKey="emtct"
                disabled={
                  sessionStorage.getItem("department") === "1" ? true : false
                }
              >
                <Container>
                  <br />
                  <h5>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="text-primary bi bi-cpu-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                      <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z" />
                    </svg>{" "}
                    {"  "}
                    Mother Infant Pair Management
                    <ButtonGroup className="float-end border-0">
                      <Button
                        onClick={() => {
                          setAddBabyModal(true);
                        }}
                        variant="primary"
                        className="btn-sm float-end border-0"
                        style={{ borderRadius: "0px" }}
                      >
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="text-white bi bi-plus-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                        {"    "}
                        Add Baby
                      </Button>
                      {babies.length > 0 ? (
                        <></>
                      ) : (
                        <>
                          {" "}
                          <Button
                            variant="outline-primary"
                            onClick={() => {
                              setAppointmentModal(true);
                            }}
                          >
                            Book Appointment
                          </Button>
                        </>
                      )}

                      {emtctEnrolled ? (
                        <>
                          <Button
                            variant="outline-primary"
                            // disabled={emtctEnrolled ? true : false}
                            onClick={() => {
                              setInEmtctModal(true);
                            }}
                          >
                            Enroll Mother
                          </Button>
                        </>
                      ) : (
                        <></>
                      )}
                    </ButtonGroup>
                  </h5>
                  <hr />
                  <FilterableTable
                    data={babies}
                    fields={emtctFields}
                    topPagerVisible={false}
                    pageSize={6}
                    pageSizes={false}
                  />
                </Container>
              </Tab>
              <Tab title="Address Book" eventKey="contacts">
                <Container>
                  <br />
                  <h5 className="text-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-journal-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z" />
                      <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                      <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                    </svg>
                    {"  "}
                    Contact List
                    <Button
                      onClick={() => {
                        setContactModal(true);
                      }}
                      className="float-end btn-sm"
                      style={{ borderRadius: "25px" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="text-white bi bi-plus-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      </svg>
                      {"  "}
                      Add Contact
                    </Button>
                  </h5>
                  <hr />
                  <FilterableTable
                    data={viewContacts}
                    fields={contactFields}
                    topPagerVisible={false}
                    pageSize={6}
                    pageSizes={false}
                  />
                </Container>
              </Tab>
              <Tab title="Mortality" eventKey="mortality">
                <Container>
                  <br />
                  <h5 className="text-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-journal-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z" />
                      <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                      <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                    </svg>
                    {"  "}
                    Status
                    <Button
                      onClick={() => {
                        setDeathModal(true);
                      }}
                      className="float-end btn-sm"
                      style={{ borderRadius: "25px" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="text-white bi bi-plus-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      </svg>
                      {"  "}
                      Report Death
                    </Button>
                  </h5>
                  <hr />
                  <FilterableTable
                    data={viewDeaths}
                    topPagerVisible={false}
                    pageSize={6}
                    pageSizes={false}
                  />
                </Container>
              </Tab>
              {/* <Tab eventKey="docs" title="Documents">
                      <h5 className="component">Download Files</h5>
                      <Documents />
                    </Tab> */}
            </Tabs>
          </div>
        </div>
      </Container>
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

              {sessionStorage.getItem("department") === "2" ? (
                <>
                  <label>Is previous viral load collection suppressed ?</label>
                  <select
                    className="form-control"
                    onChange={isPreviousViralSuppressedHandler}
                  >
                    <optgroup label="is previous viral load suppressed ? ">
                      <option value={0}>Select</option>
                      <option value={1}>Yes</option>
                      <option value={2}>No</option>
                    </optgroup>
                  </select>
                  <Alert variant="info">
                    <p>
                      The Appointments system creates three appointments
                      pregnnan mothers
                    </p>
                  </Alert>
                </>
              ) : (
                <></>
              )}
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
          {/*  */}
          <Button
            onClick={() => {
              sessionStorage.getItem("department") === "2"
                ? eMTCTAppointment()
                : bookAppointment();
              // notificationHandler();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for enrolling 
      Mother or guardian into eMTCTC */}
      <Modal show={inEmtctModal} dialogClassName="modal-lg">
        <Modal.Header>
          <h5>Enrolled Mother</h5>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormCheckLabel>Entry Level</FormCheckLabel>
            <select
              className="form-control"
              onChange={(e) => {
                setEntryLevel(e.target.value);
              }}
            >
              <optgroup label="Entry Level">
                <option value={0}>Select</option>
                <option value={1}>Antepartum</option>
                <option value={2}>Post Partum</option>
              </optgroup>
            </select>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={emtctEnrollment}>Submit</Button>
        </Modal.Footer>
      </Modal>

      {/* add baby modal */}
      {/* add baby */}
      <Modal
        show={addBabyModal}
        onHide={() => {
          setAddBabyModal(false);
        }}
        dialogClassName="modal-xl"
        // style={{ width: "80%" }}
      >
        <Modal.Header closeButton>
          <h5 className="text-mutd">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            {"   "}Add Baby
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-6">
              <select
                className="form-control"
                onChange={(e) => {
                  setInfantType(e.target.value);
                }}
              >
                <optgroup label="Infant type">
                  <option value={0}>Select</option>
                  <option value={1}>Well, never-breastfeed HEI</option>
                  <option value={2}>Well breastfeed</option>
                  <option value={3}>
                    Infant completely stopped breastfeed
                  </option>
                </optgroup>
              </select>
              <br />
            </div>
            <div className="col-md-6">
              <select
                className="form-control"
                onChange={(e) => {
                  setMVLS(e.target.value);
                }}
              >
                <optgroup label="Mothers Viral Laod Suppressed">
                  <option value={0}>Select</option>
                  <option value={1}>Yes</option>
                  <option value={2}>No</option>
                </optgroup>
              </select>
              <br />
            </div>
            <div className="col-md-12">
              <FormControl
                onChange={(e) => setChID(e.target.value)}
                type="text"
                placeholder="Child unique number"
              />
              <br />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => setFname(e.target.value)}
                type="text"
                placeholder="First Name"
              />
              <br />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => setLname(e.target.value)}
                type="text"
                placeholder="Last Name"
              />
              <br />
            </div>
            <div className="col-md-6">
              <select
                onChange={(e) => setSex(e.target.value)}
                className="form-control"
              >
                <optgroup label="Gender">
                  <option disabled>Select</option>
                  <option value="1">Female</option>
                  <option value="2">Male</option>
                </optgroup>
              </select>
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => setDob(e.target.value)}
                type="date"
                placeholder=""
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              addBaby();
              setAddBabyModal(false);
              setCreateBabyAppointmentModal(false);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        dialogClassName="modal-lg"
        show={createBabyAppointmentModal}
        onHide={() => {
          setCreateBabyAppointmentModal(false);
        }}
      >
        <Modal.Header
          dialogClassName="modal-lg"
          // style={{ width: "80%" }}
          closeButton
        >
          <h5 classname="text-primary">Create Appointment</h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-12">
              <Alert variant="primary" style={{ marginBottom: 10 }}>
                The system automatically create Drug pick up, Viral Load
                Collection and Clinical Review. For the Mother.
              </Alert>
              {/* <br /> */}
              <select
                onChange={(e) => {
                  setPVLS(e.target.value);
                }}
                className="form-control"
                style={{ marginTop: 10 }}
              >
                <optgroup label="Previous Viral Load">
                  <option value="0">Previous VL</option>
                  <option value="1">Yes</option>
                  <option value="2">No</option>
                </optgroup>
              </select>
            </div>
            <div className="col-md-6">
              <select
                class="form-control"
                onChange={(e) => {
                  setInfantType(e.target.value);
                  console.log(e.target.value);
                }}
              >
                <optgroup label="Infant Type">
                  <option value="0">--Select--</option>
                  <option value={1}>on prophylaxis</option>
                  <option value={2}>On treatment</option>
                </optgroup>
              </select>

              {infantType === "1" ? (
                <>
                  <p style={{ marginTop: 10 }}>Drugs</p>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setProphylaxisArvs(e.target.checked);
                    }}
                  />{" "}
                  Prophylaxis (ARVs)
                  <br />
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setProphylaxisCtx(e.target.checked);
                    }}
                  />
                  Prophylaxis (Ctx)
                  <br />
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setDBS(e.target.checked);
                    }}
                  />{" "}
                  DBS Test <br />
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setAntibody(e.target.checked);
                    }}
                  />{" "}
                  Antibody Test
                </>
              ) : (
                <></>
              )}

              {infantType === 2 ? (
                <>
                  <label>Treatment</label>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setTreatmentArvs(e.target.checked);
                    }}
                  />{" "}
                  Treatment (ARVs)
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setProphylaxisCtx(e.target.checked);
                    }}
                  />{" "}
                  Prophylaxis (Ctx)
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setBabyTime(e.target.value);
                }}
                type="time"
              />
              <br />
            </div>
            <div className="col-md-6"></div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setBabyDate(e.target.value);
                }}
                type="date"
              />
              <br />
            </div>
            <div className="col-md-6"></div>
            <div className="col-md-6">
              <select
                onChange={(e) => {
                  setBabyClinician(e.target.value);
                }}
                className="form-control"
              >
                <optgroup label="Assignd Clinician">
                  <option>Assign Clinician</option>
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
                  setBabyCommunity(e.target.value);
                }}
                className="form-control"
              >
                <optgroup label="Assign Community">
                  <option>Assign Community Volunteers</option>
                  {community.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.first_name}
                      {row.last_name}{" "}
                    </option>
                  ))}{" "}
                </optgroup>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              createBabyAppointment();
              setCreateBabyAppointmentModal(false);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
