import React, { useEffect, useState, useMemo } from "react";
import axios from "../../requestHandler";
import Avatar from "react-avatar";
import { Button, ButtonGroup } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import history from "../../history";
import useProvince from "../functions/useProvince";
import { Modal, FormControl } from "react-bootstrap";
import { Notify } from "notiflix";
import useJsCache from "../../Hooks/useJsCache";

export default function DetailsScreen(props) {
  const [clientsData, setClientsData] = useState(null);
  const [clientNames, setClientNames] = useState("");
  const [dob, setDOB] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [artnumber, setArtNumber] = useState("");
  const [transferModal, setTransferModal] = useState(false);
  const [clinicianTransfer, setClinicianTransfer] = useState("");
  const [title, setTitle] = useState("");
  const [clinicianPhone, setClinicianPhone] = useState("");
  const [status, setStatus] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [nupn, setNupn] = useState("");

  const cached = useJsCache(
    "clientsData",
    `/api/v1/client/status/${props.uuid}`
  );
  console.log(cached);
  useEffect(() => {
    async function getStatus() {
      const request = await axios.get(`/api/v1/client/status/${props.uuid}`);
      setStatus(request.data.status);
      setStatusCode(request.data.code);
    }

    async function getClientsData() {
      await axios
        .get(`api/v1/client/detail/${props.uuid}`)
        .catch((error) => {})
        .then((response) => {
          setClientsData({
            clientsNames:
              response.data[0].first_name + "   " + response.data[0].surname,
            dob: response.data[0].dob,
            mobilePhone: response.data[0].mobile_phone_number,
          });
          setClientNames(
            response.data[0].first_name + "   " + response.data[0].surname
          );
          setClientFirstName(response.data[0].first_name);
          setClientLastName(response.data[0].surname);
          setDOB(response.data[0].date_of_birth);
          setMobilePhone(response.data[0].mobile_phone_number);
          setArtNumber(response.data[0].art_number);
          setNupn(response.data[0].patient_nupn);
        });
    }

    getClientsData();
    getStatus();
  }, [props.uuid]);
  // Cache instance
  const options = {
    method: "GET",
    headers: new Headers({
      "Content-Type": "text/html",
    }),
  };

  const [province] = useProvince([]);

  const [district, setDistrict] = useState(true);
  const [selectDistrict, setSelectDistrict] = useState(false);
  const [selectProvince, setSelectProvince] = useState(false);
  const [facility, setFacility] = useState([]);
  const [facilityTransfer, setFacilityTransfer] = useState("");
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientAge, setClientAge] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientDob, setClientDob] = useState("");
  const [clientSex, setClientSex] = useState("");

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

  //select facility
  useEffect(() => {
    async function facility() {
      const request = await axios.get(
        `api/v1/facility/facility/${selectDistrict}`
      );
      setFacility(request.data.facilities);
    }
    facility();
  }, [selectDistrict]);

  const btnTransfer = async () => {
    Notify.success("Request Submitted succesfully!");
    const hmis = sessionStorage.getItem("hmis");
    await axios
      .post("api/v1/facility/client/transfer", {
        hmis: hmis,
        art: artnumber,
        nupn: nupn,
        clientfn: clientFirstName,
        clientln: clientLastName,
        clinician: clinicianTransfer,
        title: title,
        clinicianphone: clinicianPhone,
        facility: facilityTransfer,
        uuid: props.uuid,
        date_of_birth: clientDob,
        sex: clientSex,
        nameFacility: sessionStorage.getItem("name"),
      })
      .then((response) => {
        if (response.data.status === 200) {
          Notify.success(response.data.message);
          setTransferModal(false);
        } else if (response.data.status === 401) {
          Notify.warning(response.data.message);
          setTransferModal(false);
        }
      })
      .catch((error) => {
        Notify.warning(error.message);
      });
  };

  //download card
  const downloadCardHandler = () => {
    const name = clientFirstName + "  " + clientLastName;
    const fac_phone = sessionStorage.getItem("phone");
    const fac = sessionStorage.getItem("name");
    const hmis = sessionStorage.getItem("hmis");
    window.open(
      `https://card.v2.smart-umodzi.com?hmis=${hmis}&name=${name}&nupn=${nupn}&art=${artnumber}&fac=${fac}&fac_ph=${fac_phone}`
    );
  };
  return (
    <>
      <h4
        style={{
          borderBottom: "1px solid #ddd",
          // textAlign: "center",
          padding: 15,
          fontWeight: 500,
        }}
      >
        Client Information
        <span className="float-end">
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
        </span>
      </h4>
      <div className="col-md-4">
        <div className="media">
          <div className="image">
            {clientNames ? (
              <>
                <Avatar round={true} name={"clientCas"} size={64} />
              </>
            ) : (
              <>
                <Skeleton circle={true} height={64} width={64} />
              </>
            )}
          </div>
          <div className="media-text">
            {" "}
            <p>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-person-lines-fill"
                viewBox="0 0 16 16"
              >
                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
              </svg>{" "} */}
              <span>
                {clientNames ? (
                  <>{clientNames}</>
                ) : (
                  <>
                    <Skeleton />
                  </>
                )}
                {"  "}
                {/* {data.lastname} */}
              </span>
              <br />
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-telephone-fill"
                viewBox="0 0 16 16"
              >
                <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
              </svg> */}
              {mobilePhone ? (
                <>{mobilePhone}</>
              ) : (
                <>
                  <Skeleton />
                </>
              )}
              <br />
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-bookmark-fill"
                viewBox="0 0 16 16"
              >
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              </svg> */}
              {dob ? (
                <>{dob}</>
              ) : (
                <>
                  <Skeleton />
                </>
              )}{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-4 border-left">
        <p className="text-roboto">
          {artnumber ? (
            <>{artnumber}</>
          ) : (
            <>
              <Skeleton />
            </>
          )}
          <br />

          {nupn}
        </p>
      </div>
      <div className="col-md-4">
        <ButtonGroup className="btn-sm float-end">
          {/* <Button>Exit</Button> */}
          <Button
            variant="outline-primary"
            className="btn-sm"
            onClick={() => {
              history.goBack();
            }}
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
            Back
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
            Transfer
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
            Get Card
          </Button>
        </ButtonGroup>
      </div>

      {/* Modal transfer */}
      <Modal
        show={transferModal}
        dialogClassName="modal-lg"
        onHide={() => {
          setTransferModal(false);
        }}
      >
        <Modal.Header
          style={{
            fontFamily: "Roboto",
          }}
          closeButton
        >
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
    </>
  );
}
