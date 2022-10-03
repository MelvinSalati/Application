import React, { useEffect, useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import FilterableTable from "react-filterable-table";
import useTransferIn from "../functions/useTransferIn";
import Modal from "react-bootstrap/Modal";
import axios from "../../requestHandler";
import { ToastContainer, toast } from "react-toastify";

const TransferIn = () => {
  const [data] = useTransferIn([]);
  //tabs are
  const [viewDetailsModal, setViewDetailsModal] = React.useState(false);
  const [clientUuid, setClientUuid] = React.useState("");
  const [pharmacyHistory, setPharmacyHistory] = React.useState([]);
  const [actionModal, setActionModal] = React.useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const hmis = sessionStorage.getItem("hmis");
  const [transferData, setTransferData] = React.useState([]);
  const [reload, setReload] = useState(true);
  useEffect(() => {
    async function appointmentHistory() {
      const request = await axios.get(
        `/api/v1/client/appointment/history/${clientUuid}`
      );
      setPharmacyHistory(request.data.pharmacy);
    }
    appointmentHistory();
  }, [clientUuid]);

  useEffect(() => {
    async function getTransferList() {
      await axios
        .get(`/api/v1/facility/transferin/${hmis}`)
        .then((response) => {
          setTransferData(response.data.list);
        });
    }
    getTransferList();
  }, [clientUuid, hmis]);

  const acceptTransferHandler = async () => {
    await axios
      .get(`/apaccepti/v1/client/transfer/${clientUuid}/${hmis}`)
      .then((response) => {
        setPharmacyHistory(response.data.transfer);
        if (response.data.transfer.status === 404) {
          toast.warn(response.data.message);
        } else if (response.data.transfer.status === 200) {
          toast.success(response.data.transfer.message);
          // removeItem();
        }
        setActionModal(false);
      })
      .catch((error) => {
        toast.warn(error.message);
      });
  };

  const tableBtn = (props) => {
    return (
      <>
        <ButtonGroup className="btn-sm">
          <Button
            variant="outline-primary"
            onClick={() => {
              setViewDetailsModal(true);
              setClientUuid(props.record.ArtNumber);
            }}
            className="btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-file-earmark-text-fill"
              viewBox="0 0 16 16"
            >
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1h-4z" />
            </svg>
            {"  "}
            Previous Appointment (s)
          </Button>
          {/* <Button
            variant="primary"
            className="btn-sm"
            onClick={() => {
              setActionModal(true);
              setClientUuid(props.record.ArtNumber);
              setReload(false);
            }}
          >
            Take Action
          </Button> */}
        </ButtonGroup>
      </>
    );
  };
  const fields = [
    { name: "first_name", displayName: "First Name", inputFilterable: true },
    { name: "last_name", displayName: "Last Name", inputFilterable: true },
    { name: "created_at", displayName: "Last Visit", inputFilterable: true },
    {
      name: "due_date",
      displayName: "Next Appointment Date",
      inputFilterable: true,
    },
  ];
  const tableFields = [
    { name: "SN", displayName: "SN", inputFilterable: true },
    { name: "ArtNumber", displayName: "Art Number", inputFilterable: true },
    { name: "Unique ID", displayName: "Unique ID", inputFilterable: true },
    { name: "First Name", displayName: "First Name", inputFilterable: true },
    { name: "Last Name", displayName: "Last Name", inputFilterable: true },

    {
      name: "Receiving Facility",
      displayName: "From",
      inputFilterable: true,
    },
    {
      name: "Date Transfered",
      displayName: "Date Transfered",
      inputFilterable: true,
    },
    {
      name: "Status",
      displayName: "",
      render: tableBtn,
    },
  ];
  return (
    <>
      <h5 className="component h6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-cloud-arrow-down-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z" />
        </svg>
        {"    "}
        Incoming Recipients
      </h5>
      <FilterableTable
        data={transferData}
        fields={tableFields}
        pageSize={8}
        pageSizes={false}
        topPagerVisible={false}
      />
      {/* Modall */}
      <Modal
        show={viewDetailsModal}
        dialogClassName="modal-lg"
        onHide={() => {
          setViewDetailsModal(false);
        }}
      >
        <Modal.Header className="border-bottom" closeButton>
          <h5>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-primary bi bi-clock-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
            </svg>{" "}
            Appointments
          </h5>
        </Modal.Header>
        <Modal.Body
          className="bg-light"
          style={{ padding: "10px", height: "400px" }}
        >
          <FilterableTable
            data={pharmacyHistory}
            fields={fields}
            pageSize={8}
            pageSizes={false}
            topPagerVisible={false}
          />
        </Modal.Body>
        <Modal.Footer className="bg-white">
          <Button
            onClick={() => {
              setViewDetailsModal(false);
            }}
          >
            Exit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <Modal show={actionModal} style={{ color: "#333", fontFamily: "roboto" }}>
        <Modal.Header>
          <h5>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="text-primary bi bi-info-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
            {"  "}
            Accept Transfer
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-ligt">
          <p>Please take note of the following</p>
          <p>
            - Accepting transfer means the client automatically become part of
            your treatment current.
          </p>
          <p>- The last appointments will be tracked by your facility.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setActionModal(true);
              acceptTransferHandler();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal> */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};
export default TransferIn;
