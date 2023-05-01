import React, { useEffect, useState } from "react";
import Notiflix from "notiflix";
import Container from "react-bootstrap/esm/Container";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import processBiometric from "../../processBiometric";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import axios from "../../requestHandler";
import FilterableTable from "react-filterable-table";
import Modal from "react-bootstrap/Modal";
import Avatar from "react-avatar";
import BiometricData from "./biometricData";
import Alert from "react-bootstrap/Alert";
import Swal from "sweetalert2";
import useClinicians from "../functions/useClincians";
import useCommunity from "../functions/useCommunity";
import useAppointment from "../functions/useAppointments";
import useProvince from "../functions/useProvince";
import loading from "./process.gif";
import { Form, FormLabel } from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";

const Search = () => {
  const [clinicians] = useClinicians();

  const [community] = useCommunity();
  // tabs
  const [key, setKey] = React.useState("facility");
  // search form
  const [id, setId] = React.useState("empty");
  const [firstName, setFirstName] = React.useState("empty");
  const [lastName, setLastName] = React.useState("empty");
  const [clientRegistrationFacility, setClientRegistrationFacility] =
    React.useState("");
  const [showVerificationForm, setShowVerificationForm] = React.useState(false);
  // search button
  const [searchBynames, setSearchByNames] = React.useState(true);
  const [searchBarcode, setSearchBarcode] = React.useState(false);
  const [searchByPhone, setSearchByPhone] = React.useState(false);
  const [searchById, setSearchById] = React.useState(false);
  const [searchType, setSearchType] = React.useState(1);
  const [isTransfered, setIsTransfered] = React.useState(false);
  const [results, setResults] = React.useState(false);

  /**
   * Searches for a specific query within an array of items.
   *
   * @param {Array} items - The array of items to search within.
   * @param {string} query - The query string to search for.
   * @returns {Array} - An array of items that match the query.
   */

  const searchHandler = async () => {
    Notiflix.Loading.circle("Searching...");
    if (id === "empty") {
      return false;
    }
    setProcessMsg(false);
    const request = await axios
      .post("/api/v1/search", {
        type: searchType,
        param: id,
        hmis: sessionStorage.getItem("hmis"),
      })
      .catch(function (error) {
        if (error.request.status === 0) {
          setMessageResponse(false);
          setIsSearchingFingerPrint(false);
          Notify.warning(error.message);
        }
      });

    if (request.data.results[0].status === 404) {
      const message = request.data.results[0].message;
      Notify.warning(message);
    } else if (request.data.status === 401) {
      Notify.warning(request.data.message);
    } else if (request.data.results[0].status === 201) {
      //  search by temporal number
      setShowVerificationForm(true);
    } else {
      // success
      setResults(request.data.results);
      setIsSearchingFingerPrint(false);
      capturedBiometricData(false);
      Notiflix.Loading.remove();
    }
    Notiflix.Loading.remove();
  };
  // if search rsults
  useEffect(() => {
    Notiflix.Loading.remove();
  }, [results]);
  const [token, setTokenID] = React.useState("");
  const optSearchHandler = async () => {
    if (token.length === 6) {
      await axios
        .post("/api/v1/search/otp", {
          otp: token,
          phone: id,
          type: 5,
          hmis: sessionStorage.getItem("hmis"),
        })
        .then((response) => {
          if (response.data.results[0].status === 404) {
            Notiflix.warning(response.data.results[0].message);
            setShowVerificationForm(false);
          } else {
            setShowVerificationForm(false);

            setResults(response.data.results);
          }
        })
        .catch((error) => {
          Notiflix.error(error.message);
        });
    } else {
      toast.warn("Invalid token length");
    }
  };

  const [remoteFile, setRemoteFile] = React.useState(false);
  const [capturedBiometricData, setCapturedBiometricData] =
    React.useState("false");
  const [messageResponse, setMessageResponse] = React.useState(false);
  const [biometricResults, setBiometricResults] = React.useState(false);
  const [processMsg, setProcessMsg] = React.useState(false);
  const [isSearchingFingerPrint, setIsSearchingFingerPrint] =
    React.useState(false);

  const [emtctEnrolled, setEmtctEnrolled] = React.useState("...");
  const isEnrolled = async () => {
    await axios.get(`api/v1/emtct/enroll/${clientUuid}`).then((response) => {
      setEmtctEnrolled(!response.data.status);
      console.log(response.data.status);
    });
  };
  const CaptureBiometricFinger = async () => {
    const request = await axios.post(
      "http://localhost:15896/api/CloudScanr/FPCapture",
      {
        CustomerKey: "1848CF9353844080B58154394CA960A6",
        CaptureType: "SingleCapture",
        CaptureMode: "TemplateOnly",
        QuickScan: false,
      }
    );

    const CapturedBiometrics = request.data;
    setCapturedBiometricData(CapturedBiometrics.TemplateData);
    setMessageResponse(CapturedBiometrics.CloudScanrStatus.Message);
    if (CapturedBiometrics.CloudScanrStatus.Success === false) {
      return false;
    }
  };
  const acceptTransfer = async () => {
    await axios
      .patch("/api/v1/client/transfer/accept/", {
        uuid: clientUuid,
        hmis: hmis,
      })
      .then((response) => {
        if (response.data.transfer.status === 202) {
          toast.warn(response.data.message);
          setIsTransfered(false);
        } else if (response.data.transfer.status === 200) {
          toast.success(response.data.transfer.message);
          setIsTransfered(false);
        }
      })
      .catch((error) => {
        toast.warn(error.message);
      });
  };
  useEffect(() => {
    if (capturedBiometricData === "false") {
      return false;
    } else {
      const IdentifyFingerPrint = async () => {
        setIsSearchingFingerPrint(true);

        const request = await processBiometric.post("api/Biometric/Identify", {
          CustomerKey: "1848CF9353844080B58154394CA960A6",
          EngineName: "FPFF02",
          Format: "ISO",
          CaptureOperationName: "IDENTIFY",
          QuickScan: true,
          BiometricXml: capturedBiometricData,
          AppKey: "b0a1b0359bbe485fa7d7869ee8a7d5ab",
          SecretKey: "VNEP7lBLhYkvc5ES3loiEE/Fqs4=",
        });

        setBiometricResults(request.data.DetailResult[0]);

        if (request.data.OperationResult === "INVALID_TEMPLATE") {
          Swal.fire({
            icon: "error",
            text: request.data.OperationResult,
          });
          setProcessMsg(false);

          setMessageResponse(false);
          setIsSearchingFingerPrint(false);
        } else if (request.data.OperationResult === "NO_MATCH_FOUND") {
          Swal.fire({
            icon: "error",
            text: request.data.OperationResult,
          });

          setMessageResponse(false);
          setIsSearchingFingerPrint(false);
          setProcessMsg(false);
        } else if (request.data.OperationResult === "MATCH_FOUND") {
          setMessageResponse("Processing Biometric information...");
          setId(request.data.DetailResult[0].ID);
          setIsSearchingFingerPrint(true);

          searchHandler();
          // alert(id);
        } else {
          alert(request.data.OperationResult);
        }
      };
      IdentifyFingerPrint();
    }

    // if (capturedBiometricData.length) {
    //   setProcessMsg(false);
    // }
  }, [capturedBiometricData, id]);
  // Search results found
  const [updateRecordModal, setUpdateRecordModal] = React.useState(false);

  // open update modal
  const openModalUpdate = () => {
    setUpdateRecordModal(true);
  };

  // mother infant appointments

  const [visitDate, setVisitDate] = React.useState(new Date());
  const [nextAppointmentDate, setNextAppointmentDate] = React.useState();
  const [mDrupPickUp, setMDrugPickUp] = React.useState(false);
  const [mViralLoadColletion, setMViralLoadColletion] = React.useState(false);
  const [mClinicalReview, setMClinicalReview] = React.useState(false);
  const [pVLSYes, setPVLSYes] = React.useState(false);
  const [pVLSNo, setPVLSNo] = React.useState(false);
  const [childsNumber, setChildsNumber] = React.useState("");
  const [infantCat, setInfantCat] = React.useState(0);
  const [infantST, setInfantST] = React.useState(false);
  const [infantDBS, setInfantDBS] = useState(false);
  const [infantCTX, setInfantCTX] = useState(false);
  const [infantARVP, setInfantARVP] = useState(false);
  const [infantARVT, setInafntARVT] = useState(false);

  const visiteDateHandler = (e) => {
    setVisitDate(e.target.value);
  };
  const nextAppointmentDateHandler = (e) => {
    setNextAppointmentDate(e.target.value);
  };
  const mDrugPickUpHandler = (e) => {
    setMDrugPickUp(e.target.checked);
  };
  const mViralLoadCollectionHandler = (e) => {
    setMViralLoadColletion(e.target.checked);
  };
  const mClinicalReviewHandler = (e) => {
    setMClinicalReview(e.target.checked);
  };
  const pVLSYesHandler = (e) => {
    setPVLSYes(e.target.checked);
  };
  const pVLSNoHandler = (e) => {
    setPVLSNo(e.target.checked);
  };
  // infant
  const childNumberHandler = (e) => {
    setChildsNumber(e.target.value);
  };
  const infantCatHandler = (e) => {
    setInfantCat(e.target.value);
  };
  const infantSThandler = (e) => {
    setInfantST(e.target.checked);
  };
  const infantDBSHandler = (e) => {
    setInfantDBS(e.target.checked);
  };
  const infantCTXHandler = (e) => {
    setInfantCTX(e.target.checked);
  };
  const infantARVPHandler = (e) => {
    setInfantARVP(e.target.checked);
  };
  const infantARVTHandler = (e) => {
    setInafntARVT(e.target.checked);
  };

  const createPairAppointment = async (e) => {
    const params = {
      vd: visitDate,
      nd: nextAppointmentDate,
      pp: mDrupPickUp,
      cv: mClinicalReview,
      mv: mViralLoadColletion,
      pvY: pVLSYes,
      pvN: pVLSNo,
      ist: infantST,
      idb: infantDBS,
      icx: infantCTX,
      iap: infantARVP,
      iav: infantARVT,
      icat: infantCat,
      childsNumber: childsNumber,
      muid: clientUuid,
    };
    await axios
      .post("api/emtct/babymotherpair/create", params)
      .catch((error) => {
        alert(error.message);
      })
      .then((success) => alert(success));
  };

  const resultsTableBtn = (props) => {
    setClientRegistrationFacility(props.record.registration_facility);
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
          <>
            {props.record.current_facility ===
            parseInt(sessionStorage.getItem("hmis")) ? (
              <>
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
                    setRemoteFile(false);
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
              </>
            ) : (
              <>
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
                    setClientRegistrationFacility(
                      props.record.current_facility
                    );
                    setIsTransfered(props.record.client_status);

                    setRemoteFile(true);
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
                  Open | Remote File
                </Button>
              </>
            )}
          </>
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
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "patient_nupn",
      displayName: "Unique ID",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "first_name",
      displayName: "First Name",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "surname",
      displayName: "Last Name",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
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
      exactFilterable: true,
      sortable: true,
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
  const [isPVLS, setIsPVLS] = React.useState("");
  const isPreviousViralSuppressedHandler = (e) => setIsPVLS(e.target.value);

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
      `https://card.v2.smart-umodzi.com?hmis=${hmis}&name=${name}&nupn=${nupn}&art=${art}&fac=${fac}&fac_ph=${fac_phone}`
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
  // send notification

  const [appointmentCategory, setAppointmentCategory] = React.useState("");

  // if (appointmentCategory === 1) {
  //   setAppointmentCategory("Pharmacy pick up");
  // } else if (appointmentCategory === 2) {
  //   setAppointmentCategory("Clinical visit");
  // } else if (appointmentCategory === 3) {
  //   setAppointmentCategory("Viral load collection");
  // } else {
  //   setAppointmentCategory("Pharmacy pick up");
  // }
  const facility_name = sessionStorage.getItem("name");

  const notificationHandler = async () => {
    await axios
      .post("/api/v1/notifications/create", {
        // message: notificationMessage,
        first_name: clientFirstName,
        last_name: clientLastName,
        facility: facility_name,
        send_to: clientRegistrationFacility,
        appointment: appointmentType,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  // appointment modal
  const [appointmentModal, setAppointmentModal] = React.useState(false);
  const hmis = sessionStorage.getItem("hmis");
  const eMTCTAppointment = async (e) => {
    axios
      .post("/api/v1/create/Emtct", {
        uuid: clientUuid,
        at: appointmentType,
        tb: timeBooked,
        nd: dateBooked,
        ca: clinicianAssigned,
        cb: communityAssigned,
        uc: updateContact,
        pv: isPVLS,
        fn: clientFirstName,
        ln: clientLastName,
        ph: clientPhone,
        ar: art,
        nu: nupn,
        dp: localStorage.getItem("departmentID"),
        code: hmis,
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
  const [infantType, setInfantType] = useState("");
  const [prophylaxisArvs, setProphylaxisArvs] = useState(false);
  const [prophylaxisCtx, setProphylaxisCtx] = useState(false);
  const [treatmentArvs, setTreatmentArvs] = useState(false);
  const [DBS, setDBS] = useState(false);
  const [antibody, setAntibody] = useState("");
  // const [prophylaxisArvs, setProphylaxisArvs] = useState("");
  // create appointment modal for
  const [babyAppointment, setBabyAppointment] = React.useState("");
  const [babyTime, setBabyTime] = React.useState("");
  const [babyDate, setBabyDate] = React.useState("");
  const [babyClinician, setBabyClinician] = React.useState("");
  const [babyCommunity, setBabyCommunity] = React.useState("");
  const [inEmtctModal, setInEmtctModal] = React.useState(false);
  const [entryLevel, setEntryLevel] = React.useState("0");
  const emtctEnrollment = async () => {
    setInEmtctModal(false);
    if (entryLevel === "0") {
      Notify.warning("Please select appropriate entry level!");
    } else {
      await axios
        .post("/api/v1/emtct/enroll", {
          uuid: clientUuid,
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
    await axios
      .get(`/api/v1/client/contact/delete/${contactId}`)
      .then((response) => {
        if (response.data.status === 200) {
          toast.success(response.data.message);
        }
      });
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
  // baby appointments

  const [pVLS, setPVLS] = useState([]);
  const babyParams = {
    uuid: clientUuid,
    date: babyDate,
    clinic: babyClinician,
    chw: babyCommunity,
    babyID: babyID,
    pvls: pVLS,
    fn: clientFirstName,
    ln: clientLastName,
    ph: clientPhone,
    ar: art,
    nu: nupn,
    dp: localStorage.getItem("departmentID"),
    code: hmis,
    type: infantType,
    parvs: prophylaxisArvs,
    pctx: prophylaxisCtx,
    tarvs: treatmentArvs,
    dbs: DBS,
    antibody: antibody,
  };
  const createBabyAppointment = async () => {
    const request = await axios.post(
      `api/v1/baby/create/appointment`,
      babyParams
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
    await axios
      .post("api/v1/facility/client/transfer", {
        hmis: hmis,
        art: art,
        nupn: nupn,
        clientfn: clientFirstName,
        clientln: clientLastName,
        clinician: clinicianTransfer,
        title: title,
        clinicianphone: clinicianPhone,
        facility: facilityTransfer,
        uuid: clientUuid,
        date_of_birth: clientDob,
        sex: clientSex,
        nameFacility: sessionStorage.getItem("name"),
      })
      .then((response) => {
        if (response.data.status === 200) {
          toast.success(response.data.message);
          setTransferModal(false);
        } else if (response.data.status === 401) {
          toast.warn(response.data.message);
          setTransferModal(false);
        }
      })
      .catch((error) => {
        toast.success(error.message);
      });
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

  useEffect(() => {
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
      const request = await axios.get(`/api/v1/client/tracking/${clientUuid}`);
      setMissedAppointments(request.data.appointments);
    }

    // check if client is enrolled in PMTCT
    // async function isEmtct() {
    //   await axios
    //     .get(`/spi/v1/emtct/enrollement/status/${clientUuid}`)
    //     .then((response) => {
    //       if (response.data.enrolled) {
    //         setEmtctEnrolled(false);
    //       }
    //     });
    // }
    // isEmtct();

    Notiflix.Loading.remove();
    async function getStatus() {
      const request = await axios.get(`/api/v1/client/status/${clientUuid}`);
      setStatus(request.data.status);
      setStatusCode(request.data.code);
    }
    // contact list status
    async function getContacts() {
      const request = await axios.get(`/api/v1/client/contacts/${clientUuid}`);
      setViewContacts(request.data.contacts);
    }
    async function getDeath() {
      const request = await axios.get(`/api/v1/client/death/${clientUuid}`);
      setViewDeaths(request.data.death);
    }
    //
    isEnrolled();
    getDeath();
    getContacts();
    clientAppointments();
    // tracking History
    trackingHistory();
    // get status informatio
    getStatus();
  }, [clientUuid]);

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
              {"  "}Search
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
                  <span className="text-success">
                    <strong>{status}</strong>
                  </span>
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
                  <span className="text-warning">
                    <strong>{status}</strong>
                  </span>
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
                  <span className="text-danger">
                    <strong>{status}</strong>
                  </span>
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
      ) : (
        <>
          {/* Show search tabs */}
          <Tabs
            onSelect={(k) => {
              setKey(k);
            }}
            activeKey={key}
          >
            <Tab title={<>Search Facility</>} eventKey="facility">
              <h5 className="component">
                {results ? (
                  <> </>
                ) : (
                  <>
                    <Button
                      style={{
                        // position: "absolute",
                        // bottom: 50,
                        // marginBottom: 50,
                        // borderRadius: "50%",
                        height: 70,
                        // width: 70,
                        // right: 250,
                      }}
                      className="float-end "
                      onClick={() => {
                        setNewClientModal(true);
                      }}
                      variant="primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        class="bi bi-person-plus-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        <path
                          fill-rule="evenodd"
                          d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                        />
                      </svg>
                      Add Client
                    </Button>
                  </>
                )}
              </h5>
              <Container
                style={{
                  position: "relative",
                  height: "inherit",
                  paddingBottom: "100px",
                }}
              >
                <div className="form-search border" style={{ padding: 20 }}>
                  <div className="alert alert-info">
                    <i className="fa fa-info-circle" aria-hidden="true"></i>{" "}
                    Please select the search modality to continue.
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-md-5 search-buttons">
                      {/* search buttons */}
                      <div className="d-grid gap-2">
                        <Button
                          onClick={() => {
                            setSearchBarcode(false);
                            setSearchById(false);
                            setSearchByNames(true);
                            setSearchByPhone(false);
                            setSearchType(1);
                          }}
                          className="btn-lg"
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
                            setSearchType(2);
                          }}
                          className="btn-lg"
                          variant="secondary"
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
                        <Button
                          onClick={() => {
                            CaptureBiometricFinger();
                          }}
                          variant="outline-secondary"
                          className="btn-lg"
                        >
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="currentColor"
                            class="bi bi-fingerprint"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z" />
                            <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332c0 .409-.022.816-.066 1.221A.5.5 0 0 1 6 8.447c.04-.37.06-.742.06-1.115V7Zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8Zm-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329Z" />
                            <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334Zm.3 1.67a.5.5 0 0 1 .449.546 10.72 10.72 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.72 9.72 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z" />
                            <path d="M3.902 4.222a4.996 4.996 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 3.996 3.996 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556Zm6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705ZM3.68 5.842a.5.5 0 0 1 .422.568c-.029.192-.044.39-.044.59 0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.531 6.531 0 0 0 3.058 7c0-.25.019-.496.054-.736a.5.5 0 0 1 .568-.422Zm8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.51 10.51 0 0 0 .584-2.678.5.5 0 0 1 .54-.456Z" />
                            <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865Zm-.89 1.257a.5.5 0 0 1 .04.706A5.478 5.478 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346Zm12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49Z" />
                          </svg>
                          Biometric Scan
                        </Button>

                        <ButtonGroup>
                          <Button
                            onClick={() => {
                              setSearchBarcode(false);
                              setSearchById(false);
                              setSearchByNames(false);
                              setSearchByPhone(true);
                              setSearchType(3);
                            }}
                            className="btn-lg"
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
                              setSearchType(4);
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
                            Recipient Fullnames
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
                              style={{
                                backgroundColor: "#F4F4F4",
                                border: "0px",
                              }}
                              onChange={(e) => {
                                setId(e.target.value);
                              }}
                            />
                            {/* <input
                              type="button"
                              name="biometricCapture"
                              value="Biometric Capture"
                              onclick="captureBiometric()"
                            />
                            <input
                              type="hidde"
                              name="templateXML"
                              id="templateXML"
                              value=""
                            /> */}
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
                            Recipient ID
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
                            Recipient Phone Number
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
                      {isSearchingFingerPrint ? (
                        <>
                          <center>
                            <br />
                            <strong className="text-danger">
                              <i class="fas fa-circle-notch fa-spin"></i>
                              {messageResponse}
                            </strong>
                          </center>
                        </>
                      ) : (
                        <>
                          <Button
                            className="float-end"
                            style={{
                              marginTop: "50px",
                              borderRadius: "5px",
                            }}
                            variant="primary"
                            onClick={() => {
                              searchHandler();
                            }}
                          >
                            Submit
                          </Button>
                        </>
                      )}
                    </div>
                    {/* <div className="col-md-12">
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
                    </div> */}
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

              {localStorage.getItem("departmentID") === "2" ? (
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
                  {/* <Alert variant="info">
                    <p>
                      The Appointments system creates three appointments
                      pregnnan mothers
                    </p>
                  </Alert> */}
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
          <Button
            onClick={() => {
              localStorage.getItem("departmentID") === "2"
                ? eMTCTAppointment()
                : bookAppointment();
              notificationHandler();
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
        a
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
              setAddBabyModal(false);
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
              className="text-primary bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            {"  "}
            Transfer client to another institution
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-12">
              <label>Clinician</label>
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
              <label>Title </label>
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
              <label>Clinician's Mobile Phone </label>
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
              <label>Province</label>
              <select
                onChange={(e) => {
                  setSelectProvince(e.target.value);
                }}
                className="form-control"
              >
                <optgroup label="Provinces">
                  <option>Select Province</option>
                  {province.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.province}
                    </option>
                  ))}{" "}
                </optgroup>
              </select>
            </div>
            <div className="col-md-6">
              <label>District</label>
              {selectDistrict ? (
                <>
                  <select
                    onChange={(e) => setSelectDistrict(e.target.value)}
                    className="form-control"
                  >
                    <option>Select district</option>
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
              <label>Facility</label>
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
                  ))}
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
      {/* finger printn process */}
      <Modal show={processMsg} dialogClassName="modallg">
        <Modal.Header>
          <h3 className="text-primary" style={{ fontWeight: 300 }}>
            Biometric
          </h3>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <center>
            {capturedBiometricData === "" ? (
              <>
                {" "}
                <br />
                {/* <img src={loading} width={250} />
            <h5 className="text-primary">Verifying finger prints...</h5> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200"
                  fill="currentColor"
                  class="text-muted bi bi-fingerprint"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z" />
                  <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332c0 .409-.022.816-.066 1.221A.5.5 0 0 1 6 8.447c.04-.37.06-.742.06-1.115V7Zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8Zm-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329Z" />
                  <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334Zm.3 1.67a.5.5 0 0 1 .449.546 10.72 10.72 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.72 9.72 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z" />
                  <path d="M3.902 4.222a4.996 4.996 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 3.996 3.996 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556Zm6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705ZM3.68 5.842a.5.5 0 0 1 .422.568c-.029.192-.044.39-.044.59 0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.531 6.531 0 0 0 3.058 7c0-.25.019-.496.054-.736a.5.5 0 0 1 .568-.422Zm8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.51 10.51 0 0 0 .584-2.678.5.5 0 0 1 .54-.456Z" />
                  <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865Zm-.89 1.257a.5.5 0 0 1 .04.706A5.478 5.478 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346Zm12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49Z" />
                </svg>
                <br />
                <br />
                <br />
                <h3 className="text-muted">Capture Left Middle Finger</h3>
              </>
            ) : (
              <>
                {" "}
                <img src={loading} width={250} />
                {messageResponse === false ? (
                  <>
                    <h5 className="text-muted" style={{ fontWeight: 400 }}>
                      Capture biometric data = <br />
                      <small>Use middle left finger</small>
                    </h5>
                  </>
                ) : (
                  <>
                    <p id="response">{messageResponse}</p>
                  </>
                )}
              </>
            )}
          </center>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ borderRadius: "25px" }}
            onClick={() => {
              CaptureBiometricFinger();
            }}
            className="btn-sm"
          >
            Scan Finger
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Search by phone */}
      <Modal show={showVerificationForm}>
        <Modal.Body>
          <div className="veriform">
            <div className="input">
              <h3 class="text-center">Verification OTP</h3>
              <br />
              <FormControl
                onChange={(e) => {
                  setTokenID(e.target.value);
                }}
                style={{ height: 50 }}
              />
              <br />{" "}
              <p className="text-muted text-center">
                Use the temporal OTP number sent to the clients handset
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setShowVerificationForm(false);
            }}
          >
            Exit
          </Button>
          <Button
            onClick={() => {
              optSearchHandler();
            }}
            variant="primary"
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Mother infant pack appointments */}
      <Modal show={false} dialogClassName="modal-lg" closeButton>
        <Modal.Header>
          <h5 className="text-secondary">Mother Infant Pair Package</h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-6">
              <label>Visit date</label>
              <FormControl type="date" onChange={visiteDateHandler} />
            </div>
            <div className="col-md-6">
              <label>Next appointment date</label>
              <FormControl type="date" onChange={nextAppointmentDateHandler} />
            </div>
            <div className="col-md-6">
              <h6 className="form-title">Mother Appointments</h6>
              <div className="row">
                <div className="col-md-6">
                  <br />
                  <div>
                    <input
                      type="checkbox"
                      style={{
                        height: 25,
                        width: 25,
                      }}
                      onChange={mDrugPickUpHandler}
                    />
                    <span
                      style={{
                        paddingLeft: 10,
                        position: "absolute",
                        fontSize: 16,
                        fontWeight: "400",
                      }}
                    >
                      Pharmacy Pick up
                    </span>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      style={{
                        height: 25,
                        width: 25,
                      }}
                      onChange={mViralLoadCollectionHandler}
                    />
                    <span
                      style={{
                        paddingLeft: 10,
                        position: "absolute",
                        fontSize: 16,
                        fontWeight: "400",
                      }}
                    >
                      Viral Load Collection
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    style={{
                      height: 25,
                      width: 25,
                    }}
                    onChange={mClinicalReviewHandler}
                  />
                  <span
                    style={{
                      paddingLeft: 10,
                      position: "absolute",
                      fontSize: 16,
                      fontWeight: "400",
                    }}
                  >
                    Clinical review
                  </span>
                </div>
                <h6>Is previous Viral load suppressed ? </h6>
                <div>
                  <input
                    id="yes"
                    type="checkbox"
                    style={{
                      height: 25,
                      width: 25,
                    }}
                    onChange={pVLSYesHandler}
                  />
                  <span
                    style={{
                      paddingLeft: 10,
                      position: "absolute",
                      fontSize: 16,
                      fontWeight: "400",
                    }}
                  >
                    {"   "} Yes
                  </span>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="no"
                    style={{
                      height: 25,
                      width: 25,
                    }}
                    onChange={pVLSNoHandler}
                  />{" "}
                  <span
                    style={{
                      paddingLeft: 10,
                      position: "absolute",
                      fontSize: 16,
                      fontWeight: "400",
                    }}
                  >
                    {"   "} No
                  </span>
                </div>
              </div>
            </div>
            <div
              className="col-md-6"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* <h4 className="form-title">Infant</h4> */}
              <br />
              <FormLabel>Infant ID</FormLabel>
              <FormControl
                placeholder="Child No#"
                onChange={childNumberHandler}
              />
              <FormLabel>Infant category</FormLabel>
              <div className="row">
                <div className="col-md-12">
                  <select className="form-control" onChange={infantCatHandler}>
                    <optgroup label="Infant Category">
                      <option value={0}>Select</option>
                      <option value="1">
                        Hiv Exposed Infant [Prophylaxis]
                      </option>
                      <option value="2">Baby on Hiv Treatment [ARVS] </option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <hr />
              {infantCat === "1" ? (
                <>
                  <div className="col-md-12">
                    <input
                      type="checkbox"
                      style={{
                        height: 25,
                        width: 25,
                      }}
                      onChange={infantSThandler}
                    />
                    <span
                      style={{
                        paddingLeft: 10,
                        position: "absolute",
                        fontSize: 16,
                        fontWeight: "400",
                      }}
                    >
                      Serological Test
                    </span>
                  </div>
                  <div className="input-checkbox">
                    <input
                      type="checkbox"
                      style={{
                        height: 25,
                        width: 25,
                      }}
                      onChange={infantDBSHandler}
                    />
                    <span
                      style={{
                        paddingLeft: 10,
                        position: "absolute",
                        fontSize: 16,
                        fontWeight: "400",
                      }}
                    >
                      DBS
                    </span>
                  </div>

                  <div className="input-checkbox">
                    <input
                      type="checkbox"
                      style={{
                        height: 25,
                        width: 25,
                      }}
                      onChange={infantCTXHandler}
                    />

                    <span
                      style={{
                        paddingLeft: 10,
                        position: "absolute",
                        fontSize: 16,
                        fontWeight: "400",
                      }}
                    >
                      Co-trimoxazole Prophylaxis
                    </span>
                  </div>

                  <div className="input-checkbox">
                    <input
                      type="checkbox"
                      style={{
                        height: 25,
                        width: 25,
                      }}
                      onChnage={infantARVPHandler}
                    />
                    <span
                      style={{
                        paddingLeft: 10,
                        position: "absolute",
                        fontSize: 16,
                        fontWeight: "400",
                      }}
                    >
                      {" "}
                      ARVs Prophylaxis{" "}
                    </span>
                  </div>
                </>
              ) : (
                <></>
              )}
              {infantCat === "2" ? (
                <>
                  {/* treatemnrb options  */}
                  <div>
                    <input
                      type="checkbox"
                      style={{
                        height: 25,
                        width: 25,
                      }}
                      onChange={infantCTXHandler}
                    />
                    <span
                      style={{
                        paddingLeft: 10,
                        position: "absolute",
                        fontSize: 16,
                        fontWeight: "400",
                      }}
                    >
                      Co-trimoxazole (Septrin){" "}
                    </span>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      style={{
                        height: 25,
                        width: 25,
                      }}
                      onChange={infantARVTHandler}
                    />
                    <span
                      style={{
                        paddingLeft: 10,
                        position: "absolute",
                        fontSize: 16,
                        fontWeight: "400",
                      }}
                    >
                      ARVs Treatment
                    </span>
                  </div>
                </>
              ) : (
                <></>
              )}

              {/* oN treatment  */}
            </div>
            <div className="col-md-12">
              {/* <hr /> */}
              {/* <label>Assign Appointment to SMAG</label>
              <select className="form-control">
                <optgroup label="Assign  Clinicians">
                  <option value="">Select Community volunteer</option>
                  {community.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.first_name}
                      {row.last_name}
                    </option>
                  ))}
                </optgroup>
              </select> */}
              {/* {console.log(community.id + "  get")} */}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createPairAppointment}>Submit</Button>
        </Modal.Footer>
      </Modal>
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
    </>
  );
};
export default Search;
