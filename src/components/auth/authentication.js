import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "../../App.css";
import Swal from "sweetalert2";
import axio from "../../requestHandler";
import Logo from "./../icon.jpeg";
import history from "../../history";
import BiometricDevice from "../../device";
import axios from "axios";

const Authentication = () => {
  useEffect(() => {
    async function appointmentReminder() {
      const response = await axios
        .get(`https://broadcaster.v1.smart-umodzi.com/public/reminder`)
        .then((response) => {
          console.log("Reminder system running....");
        })
        .catch((error) => {
          console.log("Reminder system not running due to " + error.message);
        });
    }
    async function appointmentMissed() {
      const response = await axios
        .get(`https://broadcaster.v1.smart-umodzi.com/public/missed`)
        .then((response) => {
          console.log("Missed appointment reminder system running....");
        })
        .catch((error) => {
          console.log(
            "Missed appointment reminder system not running due to " +
              error.message
          );
        });
    }

    async function promptTracking() {
      const response = await axios
        .get(`https://broadcaster.v1.smart-umodzi.com/public/instant`)
        .then((response) => {
          console.log("Missed appointment reminder system running....");
        })
        .catch((error) => {
          console.log(
            "Missed appointment reminder system not running due to " +
              error.message
          );
        });
    }
    appointmentReminder();
    appointmentMissed();
    promptTracking();
  });
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [buttonState, setButtonState] = React.useState(false);

  //biometric device authentication
  const getToken = async () => {
    const Token = await BiometricDevice.post(
      "/api/CloudABISMatchingServers/Token",
      {
        BaseAPIURL: "https://fpsvr101.cloudabis.com/v1/",
        AppKey: "b0a1b0359bbe485fa7d7869ee8a7d5ab",
        SecretKey: "VNEP7lBLhYkvc5ES3loiEE/Fqs4=",
      }
    );
    //store token in sesion
    sessionStorage.setItem("token", Token.data.ResponseData.access_token);
  };

  const submitHandler = async (event) => {
    // event.preventDefault();

    setButtonState(true);
    const request = await axio.post("api/v1/user/login", {
      email: email,
      password: password,
    });
    if (request.data.status === 200) {
      history.push("/app");
      getToken();
      sessionStorage.setItem("hmis", request.data.facility);
      sessionStorage.setItem("name", request.data.facility_name);
      sessionStorage.setItem("username", request.data.username);
      sessionStorage.setItem("first_name", request.data.first_name);
      sessionStorage.setItem("last_name", request.data.last_name);
      sessionStorage.setItem("id", request.data.id);
      sessionStorage.setItem("phone", request.data.phone);
      sessionStorage.setItem("lat", request.data.latitude);
      sessionStorage.setItem("lon", request.data.longitude);
    } else if (request.data.status === 401) {
      Swal.fire({
        text: request.data.message,
        icon: "warning",
        confirmButtonText: "Exit",
      });
      setButtonState(false);
    }
  };

  return (
    <>
      <Navbar expand="lg" variant="light" bg="white" className="border-bottom">
        <Container>
          <Navbar.Brand href="#" className="text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="currentColor"
              className="text-muted bi bi-activity"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"
              />
            </svg>
            {"  "}
            <strong>Appointment Management System</strong>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div className="container" id="login">
        <center>
          <img src={Logo} alt="" height={70} width={70} />
          <h3 className="text-muted">Authentication</h3>
        </center>
        <FormGroup>
          <div className="input">
            <span className="input-icon"></span>
            <FormControl
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="Email"
            />
          </div>
        </FormGroup>
        <br />
        <FormGroup>
          <div className="input">
            <span className="input-icon"></span>
            <FormControl
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Password"
            />
          </div>
          <hr />
        </FormGroup>
        <FormGroup>
          <Button
            onClick={() => {
              submitHandler();
            }}
            // type="submit"
            className="btn-block"
            id="btn-login"
            disabled={buttonState}
          >
            Submit
          </Button>
        </FormGroup>
      </div>
    </>
  );
};
export default Authentication;
