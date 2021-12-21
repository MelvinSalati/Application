import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import TreatmentInteruptions from "./interruption";
import TransferIn from "./transferIn";
import TransferOut from "./transferOut";

const Events = () => {
  const [key, setKey] = React.useState("out");
  return (
    <>
      <Container>
        <h5 className="component h5">
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
          {"   "}
          Events In
        </h5>
        <Tabs
          onSelect={(k) => {
            setKey(k);
          }}
          activeKey={key}
        >
          <Tab eventKey="out" title="Recipients Transfered Out">
            <TransferOut />
          </Tab>
          <Tab eventKey="in" title="Recipients Transfered In">
            <TransferIn />
          </Tab>
          <Tab eventKey="ti" title="Treatment Interuptions">
            <TreatmentInteruptions />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};
export default Events;
