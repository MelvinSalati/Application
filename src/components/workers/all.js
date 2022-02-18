import React from "react";
import FilterableTable from "react-filterable-table";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import useWorkers from "../functions/useWorkers";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import axios from "../../requestHandler";
import Avatar from "react-avatar";

const ShowAll = () => {
  const hmis = sessionStorage.getItem("hmis");
  //add user
  const [addUser, setAddUser] = React.useState(false);

  const [fname, setFname] = React.useState("null");
  const [lname, setLname] = React.useState("null");
  const [email, setEmail] = React.useState("null");
  const [phone, setPhone] = React.useState("null");
  const [roleID, setRoleID] = React.useState("null");
  const [chwId, setChwId] = React.useState("null");
  const [proffession, setProffession] = React.useState("null");
  const [password, setPassword] = React.useState("null");
  const [tableData, setTableData] = useWorkers();
  const [uPass, setUPass] = React.useState("");

  //modal

  const [userUpdateModal, setUserUpdateModal] = React.useState(false);

  //add user
  const addUserHandler = async () => {
    const request = await axios.get(
      `api/v1/facility/adduser/${fname}/${lname}/${email}/${phone}/${roleID}/${proffession}/${password}/${hmis}`
    );
    if (request.data.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: request.data.message,
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: request.data.message,
      });
    }
  };
  //prevent edit,
  const updateUser = async () => {
    const request = await axios.get(
      `api/v1/facility/updateuser/${chwId}/${uPass}`
    );
    if (request.data.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: request.data.message,
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: request.data.message,
      });
    }
  };

  const profileImg = (props) => {
    return (
      <>
        <Avatar name={props.record.username} size={34} round={true} />
      </>
    );
  };
  const tableBtn = (props) => {
    const userID = parseInt(sessionStorage.getItem("id"));
    return (
      <>
        {props.record.id === userID ? (
          <>
            {" "}
            <Button
              onClick={() => {
                setChwId(props.record.id);
                setUserUpdateModal(true);
              }}
              variant="outline-primary"
              className="btn-sm"
            >
              <i class="fas fa-users-cog"></i>
              {"   "}Change Password
            </Button>
          </>
        ) : (
          <></>
        )}
      </>
    );
  };
  const tableFields = [
    { name: "sn", displayName: "SN", inputFilterable: true },

    { name: "", displayName: "Image", render: profileImg },
    { name: "fn", displayName: "First Name", inputFilterable: true },
    { name: "ln", displayName: "Last Name", inputFilterable: true },
    { name: "em", displayName: "Email", inputFilterable: true },

    { name: "ph", displayName: "Phone", inputFilterable: true },
    { name: "proffession", displayName: "Proffession", inputFilterable: true },
    { name: "da", displayName: "Registered On", inputFilterable: true },
    { name: "", displayName: "", render: tableBtn },
  ];
  return (
    <>
      <Container>
        <h5 className="component">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
          {"  "}
          Facility registered users
          <Button
            onClick={() => {
              setAddUser(true);
            }}
            className="btn-sm float-end"
          >
            Add User
          </Button>
        </h5>
        <FilterableTable
          data={tableData}
          topPagerVisible={false}
          fields={tableFields}
          pageSize={8}
          pageSizes={false}
        />
      </Container>
      {/* update password */}
      <Modal
        show={userUpdateModal}
        dialogClassName="modal-lg"
        onHide={() => {
          setUserUpdateModal(false);
        }}
      >
        <Modal.Header closeButton>
          <h5>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            {"   "}
            Update Password
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-6">
              <FormControl name="fn" placeholder="First Name" disabled />
            </div>
            <div className="col-md-6">
              <FormControl name="ln" disabled placeholder="Last Name" />
            </div>
            <div className="col-md-12">
              <br />
              <FormControl name="ph" disabled placeholder="Phone number" />
            </div>
            <div className="col-md-12">
              <br />
              <FormControl name="email" disabled placeholder="Email" />
            </div>
            <div className="col-md-12">
              <br />
              <FormControl
                type="password"
                name="pas"
                onChange={(e) => {
                  setUPass(e.target.value);
                }}
                placeholder="Password"
                autocomplete="off"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              updateUser();
              setUserUpdateModal(false);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add users */}
      <Modal
        show={addUser}
        dialogClassName="modal-lg"
        onHide={() => {
          setAddUser(false);
        }}
      >
        <Modal.Header closeButton>
          <h5>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            {"   "}
            Register Users
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="row">
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setFname(e.target.value);
                }}
                placeholder="First Name"
              />
            </div>
            <div className="col-md-6">
              <FormControl
                onChange={(e) => {
                  setLname(e.target.value);
                }}
                placeholder="Last Name"
              />
            </div>
            <div className="col-md-12">
              <br />
              <FormControl
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                placeholder="Phone number"
              />
            </div>
            <div className="col-md-12">
              <br />
              <FormControl
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Email"
              />
            </div>
            <div className="col-md-6">
              <br />
              <select
                onChange={(e) => {
                  setRoleID(e.target.value);
                }}
                className="form-control"
              >
                <optgroup label="Available roles">
                  <option>Select</option>
                  <option value="1">Clinician</option>
                  <option value="2">Monitoring and Evaluation</option>
                  <option value="3">Community Health Worker (CHW)</option>
                </optgroup>
              </select>
            </div>
            <div className="col-md-6">
              <br />
              <FormControl
                onChange={(e) => {
                  setProffession(e.target.value);
                }}
                type="text"
                placeholder="Proffession"
              />
            </div>
            <div className="col-md-6">
              <br />
              <FormControl
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              addUserHandler();
              setAddUser(false);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ShowAll;
