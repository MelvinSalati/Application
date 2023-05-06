import React from "react";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import Button from "react-bootstrap/Button";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "../../App.css";
import axio from "../../requestHandler";
import Logo from "./../icon.jpeg";
import history from "../../history";
import Notiflix from "notiflix";

const Authentication = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [buttonState, setButtonState] = React.useState(false);

  //biometric device authentication
  const [department, setDepartment] = React.useState("");
  const changeDepartmentHandler = (e) => {
    setDepartment(e.target.value);
  };

  const submitHandler = async (event) => {
    // event.preventDefault();

    if (department === "undefined" || department === "" || department === "0") {
      return Notify.warning("Please select department to continue!!!", 4000);
    }

    setButtonState(true);
    Notiflix.Loading.circle("Please wait..");
    const request = await axio.post("api/v1/user/login", {
      email: email,
      password: password,
    });
    if (request.data.status === 200) {
      history.push({
        pathname: "/app",
        // search: "?name=sudheer",
        state: {
          details: {
            hmis: request.data.facility,
            name: request.data.facility_name,
            username: request.data.username,
            first_name: request.data.first_name,
            last_name: request.data.last_name,
            id: request.data.id,
            phone: request.data.phone,
            department: department,
          },
        },
      });
    } else if (request.data.status === 401) {
      Notify.warning(request.data.message);
      setButtonState(false);
      Notiflix.Loading.remove();
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
          <h3 className="text-muted">User Authentication</h3>
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
        </FormGroup>

        <FormGroup>
          <div className="input">
            <span className="input-icon"></span>
            <select className="form-control" onChange={changeDepartmentHandler}>
              <optgroup label="Select Department">
                <option value="0">Select</option>
                <option value={1}>General ART</option>
                <option value={2}>ART MCH Services</option>
              </optgroup>
            </select>
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
