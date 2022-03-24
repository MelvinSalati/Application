import React, { useEffect } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import FilterableTable from "react-filterable-table";
import useTransferIn from "../functions/useTransferIn";
import Modal from "react-bootstrap/Modal";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import axios from "../../requestHandler";

const TransferIn = () => {
  const [data, setData] = useTransferIn([]);
  //tabs are
  const [key, setKey] = React.useState("pharmacy");
  const [viewDetailsModal, setViewDetailsModal] = React.useState(false);
  const [clientUuid, setClientUuid] = React.useState("");
  const [pharmacyHistory, setPharmacyHistory] = React.useState([]);
  const [labHistory, setLabHistory] = React.useState("");

  useEffect(() => {
    async function appointmentHistory() {
      const request = await axios.get(
        `/api/v1/client/appointment/history/${clientUuid}`
      );
      setPharmacyHistory(request.data.pharmacy);
    }
    appointmentHistory();
  }, [clientUuid]);
  // useEffect(() => {
  //   async function acceptTransfer() {
  //     const request = await axios.get(
  //       `/api/v1/client/transfer/accept/${clientUuid}`
  //     );
  //     setPharmacyHistory(request.data.pharmacy);
  //   }
  //   acceptTransfer();
  // }, [clientUuid]);

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
            View details
          </Button>
          {/* <Button variant="primary" className="btn-sm">
            Accept Transfer
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
        data={data}
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
        <Modal.Header
          style={{ backgroundColor: "#F4F4F4" }}
          className="border-bottom"
          closeButton
        >
          <h5>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-clock-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
            </svg>{" "}
            Previous Appointments
          </h5>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px", height: "400px" }}>
          <br />
          <Tabs
            onSelect={(k) => {
              setKey(k);
            }}
            activeKey={key}
            // className="bg-light"
          >
            <Tab title="Last Pharmacy Appointment" eventKey="pharmacy">
              {/* {pharmacyHistory} */}
              <br />
              <FilterableTable
                data={pharmacyHistory}
                fields={fields}
                pageSize={8}
                pageSizes={false}
                topPagerVisible={false}
              />
            </Tab>
            {/* <Tab
              style={modalStyle}
              title="Laboratory Appointments"
              eventKey="lab"
            >
              <br />
              <center>
                <i className="fas fa-vials fa-4x"></i>
                <h3>Previous Viral Load Results</h3>
                <hr></hr>
                <h1 className="text-primary">500 copies/Ml</h1>
              </center>

              {labHistory}
            </Tab> */}
          </Tabs>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            onClick={() => {
              setViewDetailsModal(false);
            }}
          >
            Exit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default TransferIn;
