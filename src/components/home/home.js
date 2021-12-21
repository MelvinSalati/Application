import React from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/esm/Container";
import Icon from "../icon.jpeg";
import Avatar from "react-avatar";
//components
import Charts from "../charts/charts";
import Search from "../search/search";
import Notices from "../notices/notices";
import history from "../../history";
import Scheduled from "../appointments/scheduled";
import Events from "../events/events";
import Tracking from "../tracking/tracking";
import Reports from "../reports/reports";
import Badge from "react-bootstrap/badge";
import Button from "react-bootstrap/esm/Button";
import useRemoteNotifications from "../functions/useRemoteNotifications";
import axios from "../../requestHandler";
import Workers from "../workers/workers";

const Home = () => {
  const [checkNotifications, setCheckNotifications] = React.useState(false);
  const [notifications, setNotifications] = useRemoteNotifications([]);

  //read notification
  const readNotification = async (id) => {
    const request = await axios.get(
      `/api/v1/facility/notifications/read/${id}`
    );
  };
  //menu
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  };
  //component selection
  const [componentName, setComponentName] = React.useState("charts");

  const component = () => {
    if (componentName === "charts") {
      return <Charts />;
    } else if (componentName === "search") {
      return <Search />;
    } else if (componentName === "notices") {
      return <Notices />;
    } else if (componentName === "scheduled") {
      return <Scheduled />;
    } else if (componentName === "events") {
      return <Events />;
    } else if (componentName === "tracking") {
      return <Tracking />;
    } else if (componentName === "reports") {
      return <Reports />;
    } else if (componentName === "workers") {
      return <Workers />;
    }
  };

  return (
    <div
    //   onClick={() => {
    //     setIsMenuOpen(false);
    //   }}
    >
      <Navbar bg="white" expand="lg" className="border-bottom">
        <Container>
          <Navbar.Brand
            className="text-secondary"
            onClick={() => {
              menu();
            }}
            style={{ fontFamily: "Roboto", fontWeight: 700 }}
          >
            <img src={Icon} alt="" width={30} height={30} />
            {"  "} <strong>{sessionStorage.getItem("name")}</strong>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown
                className="border-0"
                title={
                  <>
                    {" "}
                    {notifications ? (
                      <>
                        <span className="blink_me">
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="text-primary bi bi-envelope-exclamation-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 4.697v4.974A4.491 4.491 0 0 0 12.5 8a4.49 4.49 0 0 0-1.965.45l-.338-.207L16 4.697Z" />
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1.5a.5.5 0 0 1-1 0V11a.5.5 0 0 1 1 0Zm0 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                          </svg>
                        </span>
                      </>
                    ) : (
                      <></>
                    )}
                    {"  "}
                    Notifications
                  </>
                }
                id="basic-nav-dropdown"
              >
                <h5 className="text-primary text-center border-botto component">
                  <i className="fas fa-envelope-open-text fa-fw"></i> {"   "}
                  Remote Notifications{" "}
                </h5>
                <div
                  className="notifications list-group"
                  style={{ width: "310px", display: "flex" }}
                >
                  {notifications ? (
                    <>
                      {notifications.map((row) => (
                        <div
                          className="notification-container border-bottom"
                          style={{ width: "310px", display: "flex" }}
                        >
                          <Avatar
                            name={row.client_name}
                            size="32"
                            round={true}
                          />
                          <div className="notification-text ">
                            <p>
                              <strong className="text-muted">
                                {row.client_name}
                              </strong>{" "}
                              <br />
                              <span>{row.text}</span>
                              <br />
                              <span className="subbuttons" style={{}}>
                                <span
                                  className="border-left"
                                  onClick={() => {
                                    // setNotificationID(row.id);
                                    readNotification(row.id);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="text-primary bi bi-check2-all"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z" />
                                    <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z" />
                                  </svg>
                                  <small className="border-right">
                                    {" "}
                                    Mark as seen
                                  </small>
                                </span>
                                <span className="border-left buttons">
                                  {/* <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-person"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                  </svg> */}
                                  <small className="border-right">
                                    {" "}
                                    ID # : {row.art_number}
                                  </small>
                                </span>
                              </span>
                            </p>
                          </div>
                          <br />
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div style={{ margin: "auto" }}></div>
                    </>
                  )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="float-end bi bi-three-dots-vertical"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                </svg>
              </NavDropdown>
              <NavDropdown
                title={
                  <span>
                    <Avatar
                      name={sessionStorage.getItem("username")}
                      round={true}
                      size={30}
                    />{" "}
                    Hi,
                    {sessionStorage.getItem("first_name") +
                      "   " +
                      sessionStorage.getItem("last_name")}
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href="#action/3.1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-circle text-primary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                  </svg>
                  {"  "}
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-unlock-fill text-primary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z" />
                  </svg>
                  {"  "}
                  Exit
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* menu */}
      {isMenuOpen ? (
        <>
          <Container>
            <div className="menu bg-white">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 border-bottom">
                    <h4 className="text-center text-menu-title">Application</h4>
                  </div>
                  {/* first row  */}
                  <div className="col-md-4">
                    <div
                      className="menu-content"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setComponentName("search");
                      }}
                    >
                      <center>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="45"
                          height="45"
                          fill="currentColor"
                          className="bi bi-search"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                        <h5 className="text-muted">Search</h5>
                      </center>
                    </div>
                  </div>
                  <div className="col-md-4 border-left">
                    <div
                      className="menu-content"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setComponentName("charts");
                      }}
                    >
                      <center>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="45"
                          height="45"
                          fill="currentColor"
                          className="bi bi-bar-chart-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z" />
                        </svg>
                        <h5 className="text-muted">Charts</h5>
                      </center>
                    </div>
                  </div>
                  <div className="col-md-4 border-left">
                    <div
                      className="menu-content"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setComponentName("notices");
                      }}
                    >
                      <center>
                        <Badge className="notification-count" bg="danger">
                          10
                        </Badge>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="45"
                          height="45"
                          fill="currentColor"
                          className="bi bi-chat-left-text-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
                        </svg>
                        <h5 className="text-muted">Notices</h5>
                      </center>
                    </div>
                  </div>
                  {/* second row */}
                  <div className="col-md-4 border-bottom border-top">
                    <div
                      onClick={() => {
                        setIsMenuOpen(false);
                        setComponentName("scheduled");
                      }}
                      className="menu-content"
                    >
                      <center>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="45"
                          height="45"
                          fill="currentColor"
                          className="bi bi-activity"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"
                          />
                        </svg>
                        <h5 className="text-muted">Schedules</h5>
                      </center>
                    </div>
                  </div>
                  <div className="col-md-4 border-left border-top border-bottom">
                    <div
                      className="menu-content"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setComponentName("events");
                      }}
                    >
                      <center>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="45"
                          height="45"
                          fill="currentColor"
                          className="bi bi-bar-chart-steps"
                          viewBox="0 0 16 16"
                        >
                          <path d="M.5 0a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-1 0V.5A.5.5 0 0 1 .5 0zM2 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1z" />
                        </svg>
                        <h5 className="text-muted">Events</h5>
                      </center>
                    </div>
                  </div>
                  <div className="col-md-4 border-left border-top border-bottom">
                    <div
                      className="menu-content"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setComponentName("tracking");
                      }}
                    >
                      <center>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="45"
                          height="45"
                          fill="currentColor"
                          className="bi bi-signpost-2-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M7.293.707A1 1 0 0 0 7 1.414V2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v1H2.5a1 1 0 0 0-.8.4L.725 8.7a.5.5 0 0 0 0 .6l.975 1.3a1 1 0 0 0 .8.4H7v5h2v-5h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9V6h4.5a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.3 2.4a1 1 0 0 0-.8-.4H9v-.586A1 1 0 0 0 7.293.707z" />
                        </svg>

                        <h5 className="text-muted">Tracking</h5>
                      </center>
                    </div>
                  </div>
                  {/* third row */}
                  <div className="col-md-4">
                    <div
                      className="menu-content"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setComponentName("reports");
                      }}
                    >
                      <center>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="45"
                          height="45"
                          fill="currentColor"
                          className="bi bi-pie-chart-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.985 8.5H8.207l-5.5 5.5a8 8 0 0 0 13.277-5.5zM2 13.292A8 8 0 0 1 7.5.015v7.778l-5.5 5.5zM8.5.015V7.5h7.485A8.001 8.001 0 0 0 8.5.015z" />
                        </svg>
                        <h5 className="text-muted">Reports</h5>
                      </center>
                    </div>
                  </div>
                  <div className="col-md-4 border-left">
                    <div
                      className="menu-content"
                      onClick={() => {
                        setComponentName("workers");
                        setIsMenuOpen(false);
                      }}
                    >
                      <center>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="45"
                          height="45"
                          fill="currentColor"
                          className="bi bi-people-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                          <path
                            fillRule="evenodd"
                            d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"
                          />
                          <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                        </svg>
                        <h5 className="text-muted">Workers</h5>
                      </center>
                    </div>
                  </div>
                  <div className="col-md-4 border-left">
                    <div className="menu-content">
                      <center>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="45"
                          height="45"
                          fill="currentColor"
                          className="bi bi-unlock-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z" />
                        </svg>{" "}
                        <h5 className="text-muted">Sign Off</h5>
                      </center>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </>
      ) : (
        <></>
      )}
      <div
        style={{ height: "720px" }}
        className="container bg-white border"
        id="content"
      >
        {component()}
      </div>
    </div>
  );
};
export default Home;
