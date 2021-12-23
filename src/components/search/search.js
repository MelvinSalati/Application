import React, { useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormControl from "react-bootstrap/FormControl";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import axios from "../../requestHandler";
import FilterableTable from "react-filterable-table";
import Modal from "react-bootstrap/Modal";
import Avatar from "react-avatar";
// import { GoogleMap, LoadScript } from "@react-google-maps/api";
import Swal from "sweetalert2";
import useClinicians from "../functions/useClincians";
import useCommunity from "../functions/useCommunity";
import useClientAppointments from "../functions/useClientAppointments";
import ClientAppointments from "./clientAppointments";
import useAppointment from "../functions/useAppointments";
import useProvince from "../functions/useProvince";
import useFacility from "../functions/useFacility";
import useDistrict from "../functions/useDistrict";
import Status from "../functions/clientStatus";
import chip from "./chip.svg";
const containerStyle = {
  width: "100%",
  height: "5909",
};
const css = {
  fileRule: "evenodd",
};
const center = {
  lat: -13.65517,
  lng: -32.64164,
};
const Search = () => {
  // maps
  // clinicians
  const [clinicians, setClinicians] = useClinicians();
  const [community, setCommunity] = useCommunity();
  // tabs
  const [key, setKey] = React.useState("facility");
  // search form
  const [id, setId] = React.useState("empty");
  const [firstName, setFirstName] = React.useState("empty");
  const [lastName, setLastName] = React.useState("empty");

  // search button
  const [searchBynames, setSearchByNames] = React.useState(true);
  const [searchBarcode, setSearchBarcode] = React.useState(false);
  const [searchByPhone, setSearchByPhone] = React.useState(false);
  const [searchById, setSearchById] = React.useState(false);
  const searchHandler = async () => {
    const request = await axios.get(
      `/api/v1/user/search/${id}/${firstName}/${lastName}`
    );
    if (request.data.status === 401) {
      Swal.fire({
        title: "Response",
        icon: "success",
        text: request.data.message,
        confirmButtonColor: "#007bbf",
        confirmButtonText: "Exit",
        showConfirmButton: false,
      });
    } else {
      // success
      setResults(request.data.results);
    }
  };

  // barocde search

  // Search results found
  const [updateRecordModal, setUpdateRecordModal] = React.useState(false);

  // open update modal
  const openModalUpdate = () => {
    setUpdateRecordModal(true);
  };

  const [results, setResults] = React.useState(false);

  // table buttons
  const resultsTableBtn = (props) => {
    return (
      <>
        <ButtonGroup className="btn-sm">
          <Button
            onClick={() => {
              openModalUpdate();
              setClientUuid(props.record.client_uuid);
              setClientFirstName(props.record.first_name);
              setClientLastName(props.record.surname);
              setClientAge(props.record.age);
              setClientPhone(props.record.mobile_phone_number);
              setClientDob(props.record.date_of_birth);
              setClientSex(props.record.sex);
            }}
            variant="outline-primary"
            className="btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="text-primary bi bi-cloud-plus-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm.5 4v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0z" />
            </svg>
            {"  "}
            Update
          </Button>
          <Button
            onClick={() => {
              setSelectedClient(true);
              setClientUuid(props.record.client_uuid);
              setArt(props.record.art_number);
              setNupn(props.record.patient_nupn);
              setClientFirstName(props.record.first_name);
              setClientLastName(props.record.surname);
              setClientAge(props.record.age);
              setClientPhone(props.record.mobile_phone_number);
              setClientDob(props.record.date_of_birth);
              setClientSex(props.record.sex);
            }}
            variant="primary"
            className="btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="text-white bi bi-folder-plus"
              viewBox="0 0 16 16"
            >
              <path d="m.5 3 .04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2zm5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672z" />
              <path d="M13.5 10a.5.5 0 0 1 .5.5V12h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V13h-1.5a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z" />
            </svg>{" "}
            Open File
          </Button>
        </ButtonGroup>
      </>
    );
  };

  // search table fields
  const searchTableFields = [
    {
      name: "art_number",
      displayName: "Art Number",
      inputFilterable: true,
    },
    {
      name: "patient_nupn",
      displayName: "Unique ID",
      inputFilterable: true,
    },
    {
      name: "first_name",
      displayName: "First Name",
      inputFilterable: true,
    },
    {
      name: "surname",
      displayName: "Last Name",
      inputFilterable: true,
    },
    {
      name: "sex",
      displayName: "Sex",
      inputFilterable: false,
    },
    {
      name: "date_of_birth",
      displayName: "Date of Birth",
      inputFilterable: false,
    },
    {
      name: "mobile_phone_number",
      displayName: "Phone Number",
      inputFilterable: true,
    },
    {
      name: "",
      displayName: "",
      render: resultsTableBtn,
    },
  ];

  const [clientUuid, setClientUuid] = React.useState("");
  const [clientFirstName, setClientFirstName] = React.useState("");
  const [clientLastName, setClientLastName] = React.useState("");
  const [clientAge, setClientAge] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [clientDob, setClientDob] = React.useState("");
  const [clientSex, setClientSex] = React.useState("");

  // update details
  const [updateFn, setUpdateFn] = React.useState(clientFirstName);
  const [updateLn, setUpdateLn] = React.useState("");
  const [updateDob, setUpdateDob] = React.useState("");
  const [updateSex, setUpdateSex] = React.useState("");
  const [updatePh, setUpdatePh] = React.useState("");
  const [updateGpsLat, setUpdateGpsLat] = React.useState("");
  const [updateGpsLon, setUpdateGpsLon] = React.useState("");
  const [updateAdd, setUpdateAdd] = React.useState("");

  // update button
  const UpdateHandler = async () => {
    setUpdateRecordModal(false);
    const request = await axios.post("/api/v1/client/update", {
      first_name: updateFn,
      surname: updateLn,
      date_of_birth: updateDob,
      sex: updateSex,
      mobile_phone_number: updatePh,
      add: updateAdd,
      gpslat: updateGpsLat,
      gpslon: updateGpsLon,
      id: clientUuid,
    });

    if (request.data.status === 200) {
      Swal.fire({
        title: "success",
        text: request.data.message,
        icon: "success",
        confirmButtonColor: "#007bbf",
        confirmButtonText: "Exit",
      });
    } else if (request.data.status === 401) {
      Swal.fire({
        title: "error",
        text: request.data.message,
        icon: "Failed",
        confirmButtonColor: "#007bbf",
        confirmButtonText: "Exit",
      });
    }
  };
  // selected client id
  const [selectedClient, setSelectedClient] = React.useState(false);
  const [nupn, setNupn] = React.useState("null");
  const [art, setArt] = React.useState("null");
  const [appointments, setAppointments] = React.useState([]);
  const [missedAppointments, setMissedAppointments] = React.useState([]);
  const [status, setStatus] = React.useState("");
  const [statusCode, setStatusCode] = React.useState("");
  const [appointmentTypes, setAppointmentTypes] = useAppointment();
  const [babies, setBabies] = React.useState([]);

  //download card
  const downloadCardHandler = () => {
    const name = clientFirstName + "  " + clientLastName;
    const fac_phone = sessionStorage.getItem("phone");
    const fac = sessionStorage.getItem("name");
    const hmis = sessionStorage.getItem("hmis");
    window.open(
      `http://127.0.0.1/umodzi/reports/Card?hmis=${hmis}&name=${name}&nupn=${nupn}&art=${art}&fac=${fac}&fac_ph=${fac_phone}`
    );
  };
  const [first, setFirst] = React.useState("null");
  const [last, setLast] = React.useState("null");
  const [phone, setPhone] = React.useState("null");
  const [rel, setRel] = React.useState("null");
  const [add, setAdd] = React.useState("null");
  const [confirm, setConfirm] = React.useState(false);
  const [viewContacts, setViewContacts] = React.useState([]);
  const [contactModal, setContactModal] = React.useState(false);
  const [verifyOtp, setVerifyOtp] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  // transfer
  const [province, setProvince] = useProvince([]);

  const [district, setDistrict] = React.useState(true);
  const [selectDistrict, setSelectDistrict] = React.useState(false);
  const [selectProvince, setSelectProvince] = React.useState(false);
  const [facility, setFacility] = React.useState([]);
  const [facilityTransfer, setFacilityTransfer] = React.useState("");
  const optVerification = async () => {
    setConfirmNew(false);
    const request = await axios.get(`api/v1/verify/${otp}/${phone}`);
    if (request.data.status === 200) {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    } else if (request.data.status === 401) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    }
  };
  const addContact = async () => {
    const request = await axios.get(
      `api/v1/addContact/${first}/${last}/${phone}/${rel}/${add}/${confirm}/${clientUuid}`
    );
    if (request.data.status === 200) {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    } else if (request.data.status === 201) {
      setVerifyOtp(true);
    }
  };
  // appointments create

  const [appointmentType, setAppointmentType] = React.useState("empty");
  const [timeBooked, setTimeBooked] = React.useState("empty");
  const [dateBooked, setDateBooked] = React.useState("empty");
  const [clinicianAssigned, setClinicianAssigned] = React.useState("empty");
  const [communityAssigned, setCommunityAssigned] = React.useState("empty");
  const [updateContact, setUpdateContact] = React.useState("empty");
  const [comments, setComments] = React.useState("empty");

  // appointment modal
  const [appointmentModal, setAppointmentModal] = React.useState(false);
  const hmis = sessionStorage.getItem("hmis");
  const bookAppointment = async () => {
    const request = await axios.get(
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
  // emtct client
  const [viewBabyAppointment, setViewBabyAppointment] = React.useState([]);
  const [viewBabyAppointmentModal, setViewBabyAppointmentModal] =
    React.useState(false);
  const [createBabyAppointmentModal, setCreateBabyAppointmentModal] =
    React.useState(false);
  const [babyID, setBabyID] = React.useState("");
  // create appointment modal for
  const [babyAppointment, setBabyAppointment] = React.useState("");
  const [babyTime, setBabyTime] = React.useState("");
  const [babyDate, setBabyDate] = React.useState("");
  const [babyClinician, setBabyClinician] = React.useState("");
  const [babyCommunity, setBabyCommunity] = React.useState("");
  // add baby modal
  const [addBabyModal, setAddBabyModal] = React.useState(false);
  const [chid, setChID] = React.useState("null");
  const [fname, setFname] = React.useState("null");
  const [lname, setLname] = React.useState("null");
  const [sex, setSex] = React.useState("null");
  const [dob, setDob] = React.useState("null");
  const [contactId, setContactId] = React.useState("null");
  const [deathModal, setDeathModal] = React.useState(false);
  // const [] = React.useState("null");
  // delete
  const deletedBtn = async () => {
    const request = await axios.get(
      `/api/v1/client/contact/delete/${contactId}`
    );
    if (request.data.status === 200) {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    }
  };
  const addBaby = async () => {
    const request = await axios.get(
      `/api/v1/client/baby/create/${chid}/${fname}/${lname}/${sex}/${dob}/${clientUuid}`
    );
    if (request.status === 200) {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    } else if (request.status === 401) {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    }
  };
  // death
  const [viewDeaths, setViewDeaths] = React.useState([]);
  const [reportedBy, setReportedBy] = React.useState("null");
  const [cause, setCause] = React.useState("null");
  const [dateDeath, setDateDeath] = React.useState("null");
  const [placeDeath, setPlaceDeath] = React.useState("null");
  const deathBtn = async () => {
    const request = await axios.get(
      `api/v1/client/mortality/${reportedBy}/${cause}/${dateDeath}/${placeDeath}/${clientUuid}`
    );
    if (request.status === 200) {
      Swal.fire({
        Icon: "success",
        title: "Success",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    } else {
      Swal.fire({
        Icon: "error",
        title: "Error",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    }
  };
  const emtctBtns = (props) => {
    return (
      <>
        <ButtonGroup className="btn-sm" style={{ borderRadius: "25px" }}>
          <Button
            onClick={() => {
              setViewBabyAppointmentModal(true);
              setBabyID(props.record.babyid);
            }}
            variant="outline-secondary"
            className="btn-sm border-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="text-primary bi bi-bookmark-plus-fill"
              viewBox="0 0 16 16"
            >
              <path d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5V4.5z" />
            </svg>
            {"  "}
            View
          </Button>
          <Button
            onClick={() => {
              setBabyID(props.record.babyid);
              setCreateBabyAppointmentModal(true);
            }}
            variant="outline-secondary"
            className="btn-sm border-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="text-primary bi bi-plus-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
            </svg>
            {"  "}
            Book Appointment
          </Button>
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
  // baby appointments
  const createBabyAppointment = async () => {
    const request = await axios.get(
      `api/v1/baby/create/appointment/${clientUuid}/${babyAppointment}/${babyTime}/${babyDate}/${babyClinician}/${babyCommunity}/${babyID}`
    );
    if (request.status === 200) {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    } else if (request.data.status === 401) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
    }
  };
  // transfer clinets
  // modal
  const [transferModal, setTransferModal] = React.useState(false);
  const [clinicianTransfer, setClinicianTransfer] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [clinicianPhone, setClinicianPhone] = React.useState("");
  // const [facility, setFacility] = React.useState("");

  const btnTransfer = async () => {
    const hmis = sessionStorage.getItem("hmis");
    const request = await axios.get(
      `api/v1/facility/client/transfer/${hmis}/${art}/${nupn}/${clientFirstName}/${clientLastName}/${clinicianTransfer}/${title}/${clinicianPhone}/${facilityTransfer}/${clientUuid}`
    );
    if (request.data.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
      setTransferModal(false);
    } else if (request.data.status === 401) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: request.data.message,
        confirmButtonText: "Exit",
        confirmButtonColor: "#007bbf",
      });
      setTransferModal(false);
    }
  };
  // baby data
  useEffect(
    (babyID) => {
      if (babyID) {
        async function getBabyAppointments() {
          const request = await axios.get(`api/v1/baby/appointments/${babyID}`);
          setViewBabyAppointment(request.data.appointments);
        }
        getBabyAppointments();
      }
    },
    [babyID, clientUuid]
  );

  useEffect(
    (clientUuid) => {
      if (clientUuid) {
        // baby appointments
        async function getEmtct() {
          const request = await axios.get(`/api/v1/client/baby/${clientUuid}`);
          if (request.data.status === 200) {
            setBabies(request.data.show);
          } else {
            setBabies([]);
          }
        }
        getEmtct();
        // clients appointments
        async function clientAppointments() {
          const request = await axios.get(
            `/api/v1/client/appointments/${clientUuid}`
          );
          setAppointments(request.data.appointments);
        }
        // tracking
        async function trackingHistory() {
          const request = await axios.get(
            `/api/v1/client/tracking/${clientUuid}`
          );
          setMissedAppointments(request.data.appointments);
        }
        // cleint status
        async function getStatus() {
          const request = await axios.get(
            `/api/v1/client/status/${clientUuid}`
          );
          setStatus(request.data.status);
          setStatusCode(request.data.code);
        }
        // contact list status
        async function getContacts() {
          const request = await axios.get(
            `/api/v1/client/contacts/${clientUuid}`
          );
          setViewContacts(request.data.contacts);
        }
        async function getDeath() {
          const request = await axios.get(`/api/v1/client/death/${clientUuid}`);
          setViewDeaths(request.data.death);
        }
        //
        getDeath();
        getContacts();

        clientAppointments();
        // tracking History
        trackingHistory();
        // get status informatio
        getStatus();
      }
    },
    [clientUuid]
  );

  // Transfer
  useEffect(() => {
    async function District() {
      const request = await axios.get(
        `api/v1/facility/district/${selectProvince}`
      );
      setDistrict(request.data.districts);
      setSelectDistrict(true);
    }
    District();
  }, [selectProvince]);

  useEffect(() => {
    async function facility() {
      const request = await axios.get(
        `api/v1/facility/facility/${selectDistrict}`
      );
      setFacility(request.data.facilities);
    }
    facility();
  }, [selectDistrict]);

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
  // trackingFiedls

  //new client
  const [newArtNumber, setNewArtNumber] = React.useState("null");
  const [newNupn, setNewNupn] = React.useState("null");
  const [newFname, setNewFname] = React.useState("null");
  const [newLname, setNewLname] = React.useState("null");
  const [newDob, setNewDob] = React.useState("null");
  const [newGender, setNewGender] = React.useState("null");
  const [newNrc, setNewNrc] = React.useState("null");
  const [newPhone, setNewPhone] = React.useState("null");
  const [newEmail, setNewEmail] = React.useState("null");
  const [newAddress, setNewAddress] = React.useState("null");
  const [newClientModal, setNewClientModal] = React.useState(false);
  const [confirmNew, setConfirmNew] = React.useState(false);
  const VerifyNumber = async () => {
    const request = await axios.get(`api/v1/verify/${otp}/${newPhone}`);
    if (request.data.status === 200) {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: request.data.message,
      });
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: request.data.message,
      });
    }
  };
  const addClient = async () => {
    const request = await axios.get(
      `/api/v1/facility/new/form/${newArtNumber}/${newNupn}/${newFname}/${newLname}/${newDob}/${newGender}/${newNrc}/${newPhone}/${newEmail}/${newAddress}/${hmis}`
    );
    if (request.data.status === 200) {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: request.data.message,
        confirmButtonColor: "#007bbf",
        confirmButtonText: "Exit",
      });
    } else if (request.data.status === 401) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: request.data.message,
        confirmButtonColor: "#007bbf",
        confirmButtonText: "Exit",
      });
    } else if (request.data.status === 201) {
      //confirm phone number show modak
      setVerifyOtp(true);
      setConfirmNew(true);
    }
  };

  return (
    <>
      <h4 className="text-secondary h5 component ">
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
        Find Recipients{" "}
        {selectedClient ? (
          <></>
        ) : (
          <>
            {" "}
            <Button
              onClick={() => {
                setResults(false);
              }}
              variant="outline-primary"
              className="btn-sm float-end border-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-left-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
              </svg>
              {"  "}
              Home
            </Button>
          </>
        )}
        <span className="float-end">
          {"  "}
          {selectedClient ? (
            <>
              {" "}
              {statusCode === 1 ? (
                <>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-success bi bi-shield-shaded"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 14.933a.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067v13.866zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                  </svg>
                  <span className="text-success">{status}</span>
                </>
              ) : (
                <></>
              )}
              {statusCode === 2 ? (
                <>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-warning bi bi-shield-shaded"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 14.933a.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067v13.866zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                  </svg>{" "}
                  <span className="text-warning">{status}</span>
                </>
              ) : (
                <></>
              )}
              {statusCode === 3 ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-danger bi bi-shield-shaded"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 14.933a.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067v13.866zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                  </svg>{" "}
                  <span className="text-danger">{status}</span>
                </>
              ) : (
                <></>
              )}{" "}
            </>
          ) : (
            <></>
          )}{" "}
        </span>
      </h4>
      {/* Show search results  */}
      {results ? (
        <>
          {" "}
          {/* selected client*/}
          {selectedClient ? (
            <>
              <div className="row">
                <div className="col-md-4">
                  <div className="media">
                    <div className="image">
                      <Avatar
                        round={true}
                        name={clientFirstName + " " + clientLastName}
                        size={64}
                      />{" "}
                    </div>
                    <div className="media-text">
                      <p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-person-lines-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                        </svg>{" "}
                        {clientFirstName}
                        {"  "}
                        {clientLastName}
                        <br />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-telephone-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                        </svg>
                        {clientPhone}
                        <br />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-bookmark-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                        </svg>
                        {clientDob}{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 border-left">
                  <h6>GPS Cordinates</h6>
                  <p className="text-roboto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-geo-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z" />
                    </svg>{" "}
                    Latitude : --------
                    <br />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-geo-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z" />
                    </svg>
                    Longitude : --------
                  </p>
                </div>
                <div className="col-md-4">
                  <ButtonGroup className="btn-sm float-end">
                    {/* <Button>Exit</Button> */}
                    <Button
                      onClick={() => {
                        setSelectedClient(false);
                      }}
                      variant="outline-primary"
                      className="btn-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="text-primary bi bi-arrow-left-circle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                      </svg>{" "}
                      Back Results
                    </Button>
                    <Button
                      onClick={() => {
                        setTransferModal(true);
                      }}
                      className="btn-sm btn-block"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="text-white bi bi-truck"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                      {"   "}
                      Transfer Client
                    </Button>
                    <Button
                      onClick={() => {
                        downloadCardHandler();
                      }}
                      className="btn-sm"
                      variant="outline-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="text-primary bi bi-cloud-download-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.5a.5.5 0 0 1 1 0V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.354 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V11h-1v3.293l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z" />
                      </svg>
                      {"  "}
                      Download Card
                    </Button>
                    {/* <Button>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Notices
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                          Another action
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3">
                          Something else
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Button> */}{" "}
                  </ButtonGroup>
                </div>
                <div className="col-md-12">
                  <Tabs>
                    <Tab title="Appointments" eventKey="app">
                      <br />
                      <Container>
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
                    </Tab>
                    <Tab title="Tracking Appointments" eventKey="track">
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
                    <Tab title="Manage Emtct" eventKey="emtct">
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
                          Registered Active Babies
                          <Button
                            onClick={() => {
                              setAddBabyModal(true);
                            }}
                            variant="primary"
                            className="btn-sm float-end border-0"
                            style={{ borderRadius: "25px" }}
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
            </>
          ) : (
            <>
              {" "}
              <FilterableTable
                data={results}
                fields={searchTableFields}
                topPagerVisible={false}
                pagersVisble={false}
                pageSizes={false}
                pageSize={6}
                className="table table-striped"
              />
            </>
          )}{" "}
        </>
      ) : (
        <>
          {" "}
          {/* Show search tabs */}
          <Tabs
            onSelect={(k) => {
              setKey(k);
            }}
            activeKey={key}
          >
            <Tab title={<>Search Facility</>} eventKey="facility">
              <h5 className="component">
                <i className="fas fa-users-cog fa-fw"></i> Search all clients
                accessing treatment
                <Button
                  className="float-end btn-sm"
                  onClick={() => {
                    setNewClientModal(true);
                  }}
                >
                  Add Recipient
                </Button>
              </h5>
              <Container>
                <div className="form-search">
                  <div className="row">
                    <div className="col-md-5 search-buttons">
                      {/* search buttons */}
                      <h5
                        className="text-secondary"
                        style={{ fontSize: "14px" }}
                      >
                        Click button to search
                      </h5>
                      <div className="d-grid gap-2">
                        <Button
                          onClick={() => {
                            setSearchBarcode(false);
                            setSearchById(false);
                            setSearchByNames(true);
                            setSearchByPhone(false);
                          }}
                          className="btn-sm "
                          variant="outline-secondary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            className="bi bi-person-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                          </svg>{" "}
                          {"  "}
                          Search By Names
                        </Button>
                        <Button
                          onClick={() => {
                            setSearchBarcode(true);
                            setSearchById(false);
                            setSearchByNames(false);
                            setSearchByPhone(false);
                          }}
                          className="btn-sm "
                          variant="outline-secondary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="currentColor"
                            className=" bi bi-upc"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
                          </svg>
                          {"  "}
                          Barcode scan
                        </Button>
                        <br />

                        <ButtonGroup>
                          <Button
                            onClick={() => {
                              setSearchBarcode(false);
                              setSearchById(false);
                              setSearchByNames(false);
                              setSearchByPhone(true);
                            }}
                            className="btn-sm"
                            variant="outline-primary"
                          >
                            {/* <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-telephone-plus-fill"
                              viewBox="0 0 16 16"
                            >
                              <path
                                
                                d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM12.5 1a.5.5 0 0 1 .5.5V3h1.5a.5.5 0 0 1 0 1H13v1.5a.5.5 0 0 1-1 0V4h-1.5a.5.5 0 0 1 0-1H12V1.5a.5.5 0 0 1 .5-.5z"
                              />
                            </svg>
                            {"  "} */}
                            Phone
                          </Button>
                          <Button
                            onClick={() => {
                              setSearchBarcode(false);
                              setSearchById(true);
                              setSearchByNames(false);
                              setSearchByPhone(false);
                            }}
                            variant="secondary"
                            className="btn-sm"
                          >
                            {/* <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="text-primary bi bi-plus-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                            </svg>
                            {"  "} */}
                            Recipient ID
                          </Button>
                        </ButtonGroup>
                      </div>
                    </div>
                    <div
                      style={{ paddingTop: "10px" }}
                      className="border-left col-md-7"
                    >
                      {/* search inputs */}

                      {searchBynames ? (
                        <>
                          <h4 className="text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="60"
                              height="60"
                              fill="currentColor"
                              className="bi bi-people-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                              <path d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
                              <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                            </svg>
                            <br />
                            Searching by names
                            <br />
                          </h4>
                          <div className="input-icon">
                            <span className="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-search"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                              </svg>
                            </span>
                            <FormControl
                              className="form-control-lg"
                              placeholder="type here...."
                              style={{ backgroundColor: "#F4F4F4" }}
                              onChange={(e) => {
                                setId(e.target.value);
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      {searchBarcode ? (
                        <>
                          {" "}
                          <h4 className="text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="60"
                              height="60"
                              fill="currentColor"
                              className="bi bi-upc-scan"
                              viewBox="0 0 16 16"
                            >
                              <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
                            </svg>
                            <br />
                            Scan Barcode
                            <br />
                          </h4>
                          <div className="input-icon">
                            <span className="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-search"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                              </svg>
                            </span>
                            <FormControl
                              className="form-control-lg"
                              placeholder="type here...."
                              style={{ backgroundColor: "#F4F4F4" }}
                              onChange={(e) => {
                                setId(e.target.value);
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      {searchById ? (
                        <>
                          {" "}
                          <h4 className="text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="60"
                              height="60"
                              fill="currentColor"
                              className="bi bi-123"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75v.96Z" />
                            </svg>
                            {"  "}
                            <br />
                            Searching by Art / Nupn
                            <br />
                          </h4>
                          <div className="input-icon">
                            <span className="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-search"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                              </svg>
                            </span>
                            <FormControl
                              className="form-control-lg"
                              placeholder="type here...."
                              style={{ backgroundColor: "#F4F4F4" }}
                              onChange={(e) => {
                                setId(e.target.value);
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      {searchByPhone ? (
                        <>
                          {" "}
                          <h4 className="text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="60"
                              height="60"
                              fill="currentColor"
                              className="bi bi-person-lines-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                            </svg>
                            <br />
                            Searching by Phone Number
                            <br />
                          </h4>
                          <div className="input-icon">
                            <span className="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-search"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                              </svg>
                            </span>
                            <FormControl
                              className="form-control-lg"
                              placeholder="type here...."
                              style={{ backgroundColor: "#F4F4F4" }}
                              onChange={(e) => {
                                setId(e.target.value);
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}

                      <Button
                        style={{
                          marginTop: "50px",
                          borderRadius: "25px",
                        }}
                        variant="primary"
                        className="form-control"
                        onClick={() => {
                          searchHandler();
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                    <div className="col-md-12">
                      <hr />
                      <p
                        className="text-center text-muted"
                        style={{ marginTop: "10%" }}
                      >
                        All rights reserved{" "}
                        <span className="text-primary">
                          <strong>
                            <img src={chip} />
                            Bytes-Health
                          </strong>
                        </span>
                      </p>
                    </div>
                    {/* <div className="col-md-12">
                      <FormControl type="text" placeholder="Nupn/ART" />
                      <br />
                    </div> */}
                    {/* <div className="col-md-6">
                      <FormControl
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                        type="text"
                        placeholder="First name"
                      />
                      <br />
                    </div> */}
                    {/* <div className="col-md-6">
                      <FormControl
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                        type="text"
                        placeholder="Last name"
                      />
                      <br />
                    </div> */}
                    {/* <div className="col-md-12">
                      <hr />
                      <ButtonGroup style={{ width: "100%" }}>
                        <Button
                          onClick={() => {
                            searchHandler();
                          }}
                          variant="outline-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="text-primary bi bi-search"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                          </svg>
                          {"  "}
                          Submit
                        </Button>
                        <Button variant="primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="text-white bi bi-upc-scan"
                            viewBox="0 0 16 16"
                          >
                            <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
                          </svg>
                          {"  "}
                          Barcode
                        </Button>
                      </ButtonGroup>
                    
                    </div> */}
                  </div>
                </div>
              </Container>
            </Tab>
            <Tab title={<></>} eventKey="remote" disabled>
              <Container>
                <div className="form-search">
                  <div className="row">
                    <div className="col-md-12">
                      <FormControl
                        type="text"
                        placeholder="Nupn/ART"
                        onChange={(e) => {
                          setId(e.target.value);
                        }}
                      />
                      <br />
                    </div>
                    <div className="col-md-6">
                      <FormControl
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                        type="text"
                        placeholder="First name"
                      />
                      <br />
                    </div>
                    <div className="col-md-6">
                      <FormControl
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                        type="text"
                        placeholder="Last name"
                      />
                      <br />
                    </div>
                    <div className="col-md-12">
                      <hr />
                      <ButtonGroup style={{ width: "100%" }}>
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            searchHandler();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="text-primary bi bi-search"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                          </svg>
                          {"  "}
                          Submit
                        </Button>
                        <Button variant="primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="text-white bi bi-upc-scan"
                            viewBox="0 0 16 16"
                          >
                            <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
                          </svg>
                          {"  "}
                          Barcode
                        </Button>
                        <Button variant="outline-primary">
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
                          New Client
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </div>
              </Container>
            </Tab>
          </Tabs>
        </>
      )}
      {/* update modal */}
      <Modal
        show={updateRecordModal}
        onHide={() => {
          setUpdateRecordModal(false);
        }}
        dialogClassName="modal-lg"
      >
        <Modal.Header closeButton>
          <h5 className="text-muted h4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              className="text-primary bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
            </svg>{" "}
            Patient Locator Form.
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row container-fluid">
            <div className="col-md-6">
              <FormControl
                defaultValue={clientFirstName}
                onChange={(e) => {
                  setUpdateFn(e.target.value);
                }}
                type="text"
                className="input"
                placeholder="First Name"
              />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setUpdateLn(e.target.value);
                }}
                className="input"
                defaultValue={clientLastName}
                placeholder="Last Name"
              />
            </div>

            <div className="col-md-6">
              <select
                onChange={(e) => {
                  setUpdateSex(e.target.value);
                }}
                className="input form-control"
              >
                <optgroup label="Gender">
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </optgroup>
              </select>
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setUpdateDob(e.target.value);
                }}
                className="input"
                defaultValue={clientDob}
                placeholder="Date of birth"
              />
            </div>
            <div className="col-md-12">
              <FormControl
                onChange={(e) => {
                  setUpdatePh(e.target.value);
                }}
                defaultValue={clientPhone}
                className="input"
                type="text"
                placeholder="Phone mobile"
              />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setUpdateGpsLat(e.target.value);
                }}
                className="input"
                value=""
                placeholder="GPS Latitude"
              />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setUpdateGpsLon(e.target.value);
                }}
                className="input"
                value=""
                placeholder="GPS Longitude"
              />
            </div>
            <div className="col-md-12">
              <FormControl
                onChange={(e) => {
                  setUpdateAdd(e.target.value);
                }}
                className="input"
                as="textarea"
                placeholder="Address"
                row={8}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              UpdateHandler();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
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
      {/* create baby appointments*/}
      <Modal
        dialogClassName="modal-lg"
        show={createBabyAppointmentModal}
        onHide={() => {
          setCreateBabyAppointmentModal(false);
        }}
      >
        <Modal.Header closeButton>
          <h5>Create Appointment</h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-6">
              <select
                onChange={(e) => {
                  setBabyAppointment(e.target.value);
                }}
                className="form-control"
              >
                <optgroup label="Baby Appointments">
                  <option value="">Select Appointments</option>
                  <option value="1">AZT+3TC+NVP</option>
                  <option value="2">Co-trimoxazole</option>
                  <option value="" disabled disabled></option>
                  <option value="3">Serological Test</option>
                  <option value="4">Nucleic Acid Testing</option>
                </optgroup>
              </select>
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
      {/* view baby appointments */}
      <Modal
        show={viewBabyAppointmentModal}
        onHide={() => {
          setViewBabyAppointmentModal(false);
        }}
        dialogClassName="modal-lg"
      >
        <Modal.Header closeButton>
          <h6 className="h5">Baby Appointments</h6>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <FilterableTable
            pageSize={6}
            pageSizes={false}
            topPagerVisible={false}
            data={viewBabyAppointment}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setViewBabyAppointmentModal(false);
            }}
          >
            Exit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* add baby */}
      <Modal
        show={addBabyModal}
        onHide={() => {
          setAddBabyModal(false);
        }}
        dialogClassName="modal-lg"
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
              setCreateBabyAppointmentModal(false);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* add contact */}
      {/* add baby */}
      <Modal
        show={contactModal}
        onHide={() => {
          setContactModal(false);
        }}
        dialogClassName="modal-lg"
      >
        <Modal.Header closeButton>
          <h5
            className="text-mutd"
            style={{
              fontWeight: 600,
              fontFamily: "Roboto",
            }}
          >
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
            {"   "}Add Contact information
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-6">
              <FormControl
                onChange={(e) => setFirst(e.target.value)}
                type="text"
                placeholder="First Name"
              />
              <br />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => setLast(e.target.value)}
                type="text"
                placeholder="Last Name"
              />
              <br />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                placeholder="Phone Number"
              />
              <br />
            </div>
            <div className="col-md-6">
              <select
                onChange={(e) => setRel(e.target.value)}
                className="form-control"
              >
                <optgroup label="Gender">
                  <option disabled>Select</option>
                  <option value="1">Husband</option>
                  <option value="2">wife</option>
                  <option value="3">Mother</option>
                  <option value="4">Father</option>
                  <option value="6">Sibling</option>
                  <option value="7">Uncle</option>
                  <option value="8">Aunt</option>
                  <option value="9">GrandMother</option>
                  <option value="10">GrandFather</option>
                </optgroup>
              </select>
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => setAdd(e.target.value)}
                as="textarea"
                placeholder="Address"
                required=""
              />
            </div>
            <div className="col-md-6">
              <p className="text-muted" style={{ fontFamily: "Roboto" }}>
                <span className="text-primary">
                  <input
                    onChange={(e) => {
                      setConfirm(e.target.value);
                    }}
                    type="checkbox"
                  />{" "}
                  {"  "}Confirm number
                </span>
                <br />
                The application will generate and send OTP number.
              </p>
              <br />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              addContact();
              setContactModal(false);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Otp */}
      <Modal
        show={verifyOtp}
        onHide={() => {
          setVerifyOtp(false);
        }}
      >
        <Modal.Header>
          <h5>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-lock-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            </svg>
            Verification of One Time Password (OTP)
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <Container>
            <FormControl
              onChange={(e) => {
                setOtp(e.target.value);
              }}
              style={{ fontSize: "24px" }}
              placeholder=""
            />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {confirmNew ? (
            <>
              {" "}
              <Button
                onClick={() => {
                  VerifyNumber();
                  setVerifyOtp(false);
                }}
              >
                Submit
              </Button>
            </>
          ) : (
            <>
              {" "}
              <Button
                onClick={() => {
                  optVerification();
                  setVerifyOtp(false);
                }}
              >
                Submit
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      {/* aeth */}
      <Modal
        show={deathModal}
        dialogClassName="modal-lg"
        onHide={() => {
          setDeathModal(false);
        }}
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
            {"    "}Mortality Report
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-12">
              <FormControl
                onChange={(e) => {
                  setReportedBy(e.target.value);
                }}
                placeholder="Reported by"
              />
              <br />
            </div>
            <div className="col-md-12">
              <FormControl
                onChange={(e) => {
                  setCause(e.target.value);
                }}
                placeholder="Cause Of Death"
              />
              <br />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setDateDeath(e.target.value);
                }}
                type="date"
              />
            </div>
            <div className="col-md-6">
              <select
                onChange={(e) => {
                  setPlaceDeath(e.target.value);
                }}
                className="form-control"
              >
                <optgroup label="Where death occured">
                  <option value="" Disabled>
                    Select
                  </option>
                  <option value="1">Community</option>
                  <option value="2">Health Facility</option>
                </optgroup>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setDeathModal(false);
              deathBtn();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal transfer */}
      <Modal
        show={transferModal}
        dialogClassName="modal-lg"
        onHide={() => {
          setTransferModal(false);
        }}
      >
        <Modal.Header style={{ fontFamily: "Roboto" }} closeButton>
          <h5 className="text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            {"   "}Transfer client to another institution
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-12">
              <FormControl
                onChange={(e) => {
                  setClinicianTransfer(e.target.value);
                }}
                type="text"
                placeholder="Clinician transfering"
              />
              <br />
            </div>
            <div className="col-md-6">
              {" "}
              <FormControl
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                type="text"
                placeholder="Title"
              />
              <br />
            </div>
            <div className="col-md-6">
              {" "}
              <FormControl
                onChange={(e) => {
                  setClinicianPhone(e.target.value);
                }}
                type="text"
                placeholder="Phone number"
              />
              <br />
            </div>
            <div className="col-md-6">
              <select
                onChange={(e) => {
                  setSelectProvince(e.target.value);
                }}
                className="form-control"
              >
                <optgroup label="Provinces">
                  <option disabled>Select Province</option>
                  {province.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.province}
                    </option>
                  ))}{" "}
                </optgroup>
              </select>
            </div>
            <div className="col-md-6">
              {selectDistrict ? (
                <>
                  <select
                    onChange={(e) => setSelectDistrict(e.target.value)}
                    className="form-control"
                  >
                    {district.map((row) => (
                      <option key={row.id} value={row.id}>
                        {row.district}
                      </option>
                    ))}{" "}
                  </select>
                </>
              ) : (
                <>
                  <select className="form-control" disabled>
                    <optgroup>
                      <option>Select district</option>
                    </optgroup>
                  </select>
                </>
              )}{" "}
            </div>
            <div className="col-md-12">
              <br />
              <select
                onChange={(e) => {
                  setFacilityTransfer(e.target.value);
                }}
                className="form-control"
              >
                <optgroup label="Health Facilities">
                  <option>Select Facility</option>
                  {facility.map((row) => (
                    <option key={row.id} value={row.hmis_code}>
                      {row.facility_name}
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
              btnTransfer();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* add client */}

      <Modal
        show={newClientModal}
        dialogClassName="modal-lg"
        onHide={() => {
          setNewClientModal(false);
        }}
      >
        <Modal.Header closeButton>
          <h5 className="text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="28"
              fill="currentColor"
              className="bi bi-person-plus"
              viewBox="0 0 16 16"
            >
              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
              <path d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
            </svg>
            {"  "}
            Add Recipient
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-6">
              <FormControl
                placeholder="Art Number"
                onChange={(e) => {
                  setNewArtNumber(e.target.value);
                }}
              />
              <br />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setNewNupn(e.target.value);
                }}
                placeholder="National Patient Identification Number"
              />
              <br />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setNewFname(e.target.value);
                }}
                placeholder="First Name"
              />
              <br />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setNewLname(e.target.value);
                }}
                placeholder="Last Name"
              />
              <br />
            </div>
            <div className="col-md-8">
              <FormControl
                onChange={(e) => {
                  setNewDob(e.target.value);
                }}
                type="date"
              />
            </div>
            <div className="col-md-4">
              <select
                onChange={(e) => {
                  setNewGender(e.target.value);
                }}
                className="form-control"
              >
                <optgroup label="Gender">
                  <option>Select gender</option>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </optgroup>
              </select>
            </div>
            <div className="col-md-7">
              <br />
              <FormControl
                onChange={(e) => {
                  setNewNrc(e.target.value);
                }}
                placeholder="Nrc format e.g xxxxxx/xx/1"
              />
            </div>
            <div className="col-md-5">
              <br />
              <FormControl
                onChange={(e) => {
                  setNewPhone(e.target.value);
                }}
                placeholder="Phone number"
              />
            </div>
            <div className="col-md-12">
              <br />
              <FormControl
                onChange={(e) => {
                  setNewEmail(e.target.value);
                }}
                placeholder="Email address"
              />
            </div>
            <div className="col-md-12">
              <br />
              <FormControl
                onChange={(e) => {
                  setNewAddress(e.target.value);
                }}
                as="textarea"
                row={6}
                placeholder="Address"
              />
            </div>
            <br />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              addClient();
              setNewClientModal(false);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Search;
