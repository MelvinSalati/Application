import axios from "../../requestHandler";
import React, { useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import FilterableTable from "react-filterable-table";
import useCommunity from "../functions/useCommunity";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";

const Tasks = () => {
  const [selectCbv, setSelectCbv] = useCommunity([]);
  const [tasks, setTasks] = React.useState([]);
  const [hmis, setHmis] = React.useState(sessionStorage.getItem("hmis"));
  const [taskModal, setTaskModal] = React.useState(false);
  const [chwId, setChwId] = React.useState("");
  const [taskData, setTaskData] = React.useState([]);

  useEffect(() => {
    async function getCounter() {
      const request = await axios.get(`api/v1/facility/tasks/${hmis}`);
      setTasks(request.data.tasks);
    }
    getCounter();
  }, []);

  useEffect(() => {
    if (chwId === "") {
    } else {
      async function tasks() {
        const request = await axios.get(`api/v1/facility/chw/tasks/${chwId}`);
        setTaskData(request.data.list);
      }

      tasks();
    }
  }, [chwId]);

  const taskList = () => {
    if (!chwId) {
    } else {
      window.open(
        `https://reports.v2.smart-umodzi.com/reports/list.php?user_id=${chwId}&hmis=${hmis}`
      );
    }
  };

  const clickTwice = () => {
    if (!chwId) {
      Swal.fire({
        title: "Confirm Button Action",
        icon: "warning",
        text: "Please click button to confirm action.",
      });
    }
  };

  //
  const tasksBtn = (props) => {
    return (
      <>
        <ButtonGroup className="btn-sm">
          <Button
            onClick={() => {
              setTaskModal(true);
              setChwId(props.record.id);
            }}
            className="btn-sm"
            variant="outline-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className=" text-primary  bi bi-plus-square-fill"
              viewBox="0 0 16 16"
            >
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
            </svg>
            {"  "}View tasks
          </Button>
          <Button
            onClick={() => {
              taskList();
              setChwId(props.record.id);
              clickTwice();
            }}
            className="btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="text-white bi bi-list-task"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"
              />
              <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z" />
              <path
                fill-rule="evenodd"
                d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"
              />
            </svg>
            {"   "}
            Tracking List
          </Button>
        </ButtonGroup>
      </>
    );
  };
  // fields
  const tasksField = [
    {
      name: "SN",
      displayName: "SN",
      inputFilterable: false,
    },
    {
      name: "First Name",
      displayName: "SN",
      inputFilterable: true,
    },
    {
      name: "Last Name",
      displayName: "Last Name",
      inputFilterable: false,
    },
    {
      name: "Phone Number",
      displayName: "Contact",
      inputFilterable: false,
    },
    {
      name: "Pharmacy",
      displayName: "Pharmacy",
      inputFilterable: false,
    },
    {
      name: "Clinical",
      displayName: "Clinical",
      inputFilterable: false,
    },
    {
      name: "Viral Load",
      displayName: "Viral Load",
      inputFilterable: false,
    },
    {
      name: "Cervical Cx",
      displayName: "Cervical Screen..",
      inputFilterable: false,
    },
    {
      name: "TB Prophylaxis",
      displayName: "TB Prophylaxis",
      inputFilterable: false,
    },
    {
      name: "",
      displayName: "",
      render: tasksBtn,
    },
  ];

  return (
    <>
      <Container style={{ height: "540px" }}>
        <h5 className="component">
          <i className="fas fa-users-cog"></i>
          {"   "}
          Community Health Workers Diary(s)
        </h5>
        <FilterableTable
          data={tasks}
          fields={tasksField}
          pageSize={6}
          pageSizes={false}
          topPagerVisible={false}
        />
      </Container>
      <Modal
        show={taskModal}
        dialogClassName="modal-lg"
        onHide={() => {
          setTaskModal(false);
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
            {"  "}Allocated Tasks
          </h5>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <FilterableTable
            pageSize={6}
            pageSizes={false}
            topPagerVisible={false}
            data={taskData}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setTaskModal(false);
            }}
          >
            Exit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Tasks;
