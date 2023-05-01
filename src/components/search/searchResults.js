import React, { useEffect, useState } from "react";
import Notiflix from "notiflix";
import Container from "react-bootstrap/esm/Container";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import processBiometric from "../../processBiometric";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import axios from "../../requestHandler";
import FilterableTable from "react-filterable-table";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import loading from "./process.gif";
import history from "../../history";
import NavbarScreen from "../navbar/navbar";
const Search = () => {
  // tabs
  const [key, setKey] = React.useState("facility");
  // search form
  const [id, setId] = React.useState("empty");
  const [firstName, setFirstName] = React.useState("empty");
  const [lastName, setLastName] = React.useState("empty");
  const [
    clientRegistrationFacility,
    setClientRegistrationFacility,
  ] = React.useState("");
  const [verifyOtp, setVerifyOtp] = React.useState(false);
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
      .catch(function(error) {
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
      Notify.warning("Invalid token length");
    }
  };

  const [remoteFile, setRemoteFile] = React.useState(false);
  const [capturedBiometricData, setCapturedBiometricData] = React.useState(
    "false"
  );
  const [messageResponse, setMessageResponse] = React.useState(false);
  const [processMsg, setProcessMsg] = React.useState(false);
  const [isSearchingFingerPrint, setIsSearchingFingerPrint] = React.useState(
    false
  );

  const [emtctEnrolled, setEmtctEnrolled] = React.useState("...");

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

  // Search results found
  const [updateRecordModal, setUpdateRecordModal] = React.useState(false);

  // open update modal
  const openModalUpdate = () => {
    setUpdateRecordModal(true);
  };

  const resultsTableBtn = (props) => {
    setClientRegistrationFacility(props.record.registration_facility);
    return (
      <>
        <ButtonGroup className="btn-sm">
          <Button
            onClick={() => {
              openModalUpdate(props.record.client_uuid);
            }}
            variant="outline-primary"
            className="btn-sm"
            disabled
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
                    clientsDetails(props.record.client_uuid);
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
                    clientsDetails(props.record.client_uuid);
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

  const addClient = async () => {
    const request = await axios.get(
      `/api/v1/facility/new/form/${newArtNumber}/${newNupn}/${newFname}/${newLname}/${newDob}/${newGender}/${newNrc}/${newPhone}/${newEmail}/${newAddress}/${sessionStorage.getItem(
        "hmis"
      )}`
    );
    if (request.data.status === 200) {
      Notify.success(request.data.message);
    } else if (request.data.status === 401) {
      Notify.warning("Registration failed!");
    } else if (request.data.status === 201) {
      //confirm phone number show modak
      setVerifyOtp(true);
      setConfirmNew(true);
    }
  };

  // This function navigates to the client details page for the specified client ID.
  // First, it constructs the URL for the client details page using the client ID.
  // Then, it uses the window.location object to navigate to the new URL.

  const clientsDetails = (uuid) => {
    history.push({
      pathname: "/client/profile",
      state: {
        details: {
          Uuid: uuid,
        },
      },
    });
  };
  return (
    <>
      <NavbarScreen />
      <Container
        className="bg-white container content"
        style={{ marginTop: "4%" }}
      >
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
                  <img src={loading} alt="" width={250} />
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
      </Container>
    </>
  );
};
export default Search;
