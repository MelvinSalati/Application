import React from "react";
import Container from "react-bootstrap/esm/Container";
import FilterableTable from "react-filterable-table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FormControl from "react-bootstrap/FormControl";
import Swal from "sweetalert2";

const PatientLevel = () => {
  const [email, setEmail] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [reportID, setReportID] = React.useState("");
  const [reportModal, setReportModal] = React.useState("");
  const hmis = sessionStorage.getItem("hmis");
  const todays = new Date();
  const today = todays.getDate();
  const getReport = () => {
    if (startDate === "" || endDate === "") {
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startD = start.getTime();
      const endD = end.getTime();

      if (startD < endD) {
        setReportModal(false);
        window.open(
          `http://127.0.0.1/reports.v2/report.php?report_id=${reportID}&from=${startDate}&to=${endDate}&hmis=${hmis}`
        );
      } else if (startD === endD) {
        setReportModal(false);
        window.open(
          `http://127.0.0.1/reports.v2/report.php?report_id=${reportID}&from=${startDate}&to=${endDate}&hmis=${hmis}`
        );
      } else if (endD > today) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: "Please check end date. You selected a future",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: "Please check the start date",
        });
      }
    }
  };
  const fieldBtn = (props) => {
    return (
      <>
        <Button
          className="btn-sm"
          variant="outline-primary"
          onClick={() => {
            setReportModal(true);
            setReportID(props.record.SN);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="text-primary bi bi-cloud-download-fill"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.5a.5.5 0 0 1 1 0V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.354 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V11h-1v3.293l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"
            />
          </svg>
          {"  "}
          Pick Date
        </Button>
      </>
    );
  };
  const fields = [
    {
      name: "SN",
      displayName: "SN",
    },
    {
      name: "cat",
      displayName: "Category",
    },
    {
      name: "desc",
      displayName: "Description",
    },
    {
      name: "title",
      displayName: "Title",
    },
    {
      name: "",
      displayName: "",
      render: fieldBtn,
    },
  ];
  const listOfReports = [
    {
      SN: "1",
      title: "Appointment  List",
      cat: "Appointments",
      desc: "List of recipients of care scheduled to visit the facility within a specified period.",
    },
    {
      SN: "2",
      desc: "List of recipients of care late for pharmacy pickup.",
      title: "Late Appointment List < 28 days.",
      cat: "Appointments.",
    },
    {
      SN: "3",
      desc: "List of recipients of care missing for pharmacy pickup > 28 days",
      title: "Late Appointment List > 28 days",
      cat: "Appointments / Events",
    },
    {
      SN: "4",
      desc: "List of clients who where transfered out, reaching the facility",
      title: "Transfer out",
      cat: "Events",
    },
    // {
    //   SN: "4",
    //   desc: "List of clients who where transfered out, but have not reached the facility",
    //   title: "Transfer out",
    //   cat: "Events",
    // },
  ];
  return (
    <>
      <Container style={{ height: "540px" }}>
        <h5 className="component">
          <i className="fas fa-chart-area"></i>Recipients related reports
        </h5>
        <FilterableTable
          data={listOfReports}
          fields={fields}
          topPagerVisible={false}
          pageSize={6}
          pageSizes={false}
        />
      </Container>
      <Modal
        show={reportModal}
        dialogClassName="modal-lg"
        onHide={() => {
          setReportModal(false);
        }}
      >
        <Modal.Header closeButton>
          <h5 className="text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-bar-chart-line-fill"
              viewBox="0 0 16 16"
            >
              <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2z" />
            </svg>
            {"  "}
            Generate Report
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light" style={{ height: "390px" }}>
          <div className="row">
            <div className="col-md-6">
              <label className="text-primary">Start date</label>
              <FormControl
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                type="date"
              />
            </div>
            <div className="col-md-6">
              <label className="text-primary">End date</label>
              <FormControl
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                type="date"
              />
            </div>
            <div className="col-md-12">
              <label className="text-muted">
                <br />
                {/* <input type="checkbox" onChange={setEmail} /> Tick to email */}
                {/* report */}
                <br />
              </label>
            </div>
            <div className="col-md-12">
              {email ? (
                <>
                  {" "}
                  <FormControl type="email" placeholder="Email address to.." />
                  <br />
                  <FormControl type="" placeholder="encryption_key" />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              getReport();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default PatientLevel;
