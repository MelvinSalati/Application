import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import FormControl from "react-bootstrap/FormControl";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/esm/Container";
import FilterableTable from "react-filterable-table";
import axios from "../../requestHandler";
import { ButtonGroup, Button } from "react-bootstrap";
import useRemoteNotifications from "../functions/useRemoteNotifications";
import Notiflix from "notiflix";
import { Notify } from "notiflix";
import NavbarScreen from "../navbar/navbar";
const Notices = () => {
  const hmis = sessionStorage.getItem("hmis");
  const [remoteNotifications, setRemoteNotifications] = useState([]);
  Notiflix.Loading.circle("Loading...");

  useEffect(() => {
    async function notifications() {
      await axios
        .get(`api/v1/notifications/show/${hmis}`)
        .then((response) => {
          setRemoteNotifications(response.data.notifications);
        })
        .catch((error) => {
          Notify.warning(error.message);
        });
      Notiflix.Loading.remove();
    }
    notifications();
  }, []);

  // Remove item from list
  const [serialNumber, setSerialNumber] = useState();
  const [notificationId, setNotificationId] = useState("");

  const removeItem = () => {
    var ind = remoteNotifications.findIndex(function (element) {
      return element.sn === serialNumber;
    });
    if (ind !== -1) {
      remoteNotifications.splice(ind, 1);
    }
  };

  const markAsSeenHandler = async (notificationId) => {
    if (notificationId > 0) {
      await axios
        .post("api/v1/notifications/read", {
          notificationID: notificationId,
        })
        .then((response) => {
          if (response.status === 200) {
            Notify.success("Notificationn status updated!");
          }
        })
        .catch((error) => {
          Notify.warning(error.message);
        });
    } else {
      Notify.warning("Click read notifcation again!");
    }
    Notiflix.Loading.remove();
  };
  const notificationIdHandler = (event) => {
    setNotificationId(event);
    markAsSeenHandler(event);
    removeItem();
  };

  const [notificationType, setNotificationType] = useState(2);
  const tableBtn = (props) => {
    return (
      <>
        {notificationType === 1 ? (
          <>
            {/* show buttons for transfers */}
            <ButtonGroup>
              <Button variant="outline-danger">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  classname="text-primary bi bi-check-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
              </Button>
              <Button variant="primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-cloud-download-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.5a.5.5 0 0 1 1 0V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.354 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V11h-1v3.293l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"
                  />
                </svg>
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            {/* notifications items */}
            <ButtonGroup>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setSerialNumber(props.record.SN);
                  notificationIdHandler(props.record.id);
                }}
                className="btn-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  classname="text-primary bi bi-check-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                {"  "}
                Mark as seen
              </Button>
              {/* <Button variant="primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-cloud-download-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.5a.5.5 0 0 1 1 0V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.354 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V11h-1v3.293l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"
                  />
                </svg>
              </Button> */}
            </ButtonGroup>
          </>
        )}
      </>
    );
  };
  const fields = [
    {
      name: "SN",
      displayName: "SN",
      inputFilterable: true,
    },
    {
      name: "client_name",
      displayName: "Client Name",
      inputFilterable: true,
    },
    {
      name: "text",
      displayName: "Message",
      inputFilterable: true,
    },
    {
      name: "",
      displayName: "Action",
      render: tableBtn,
    },
  ];

  return (
    <>
      <NavbarScreen />
      <Container
        className="bg-white container content"
        style={{ marginTop: "4%" }}
      >
        <h1 className="h5 component">
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
          {"    "}
          Manage Notifications
        </h1>
        <center>
          <Container>
            {remoteNotifications.length > 0 ? (
              <>
                {" "}
                <FilterableTable
                  data={remoteNotifications}
                  fields={fields}
                  pageSize={6}
                  pageSizes={false}
                  topPagerVisible={false}
                  tableClassName="table table-bordeered"
                />
              </>
            ) : (
              <>
                {/* no notification found  */}
                <Container
                  style={{ height: 300, color: "#AAA", paddingTop: 100 }}
                >
                  <i
                    className="fa fa-info-circle fa-3x text-center"
                    aria-hidden="true"
                  ></i>
                  <h4 className="text-center h3">
                    {" "}
                    No Notifications available
                  </h4>
                </Container>
              </>
            )}
          </Container>
        </center>
      </Container>
    </>
  );
};
export default Notices;
