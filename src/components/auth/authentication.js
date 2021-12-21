import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "../../App.css";
import Swal from "sweetalert2";
import axios from "../../requestHandler";
import Logo from "./../icon.jpeg";
import history from "../../history";

const Authentication = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const submitHandler = async () => {
    const request = await axios.post("api/v1/user/login", {
      email: email,
      password: password,
    });
    if (request.data.status === 200) {
      history.push("/home");
      sessionStorage.setItem("hmis", request.data.facility);
      sessionStorage.setItem("name", request.data.facility_name);
      sessionStorage.setItem("username", request.data.username);
      sessionStorage.setItem("first_name", request.data.first_name);
      sessionStorage.setItem("last_name", request.data.last_name);
      sessionStorage.setItem("id", request.data.id);
    } else if (request.data.status === 401) {
      Swal.fire({
        text: request.data.message,
        icon: "warning",
        confirmButtonText: "Exit",
      });
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
            Appointment Management System
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div className="container" id="login">
        <Form
          onSubmit={() => {
            submitHandler();
          }}
        >
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
              className="btn-block"
              id="btn-login"
            >
              Submit
            </Button>
          </FormGroup>
        </Form>
      </div>
    </>
  );
};
export default Authentication;
