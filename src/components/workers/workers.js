import React, { useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import All from "./all";
import { Container } from "react-bootstrap";
import Notiflix from "notiflix";
import NavbarScreen from "../navbar/navbar";

const Workers = () => {
  const [key, setKey] = React.useState("list");
  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      Notiflix.Loading.circle("loading");
      // do something else
      Notiflix.Loading.remove();
    };

    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
      Notiflix.Loading.remove();
    } else {
      window.addEventListener("load", onPageLoad, false);
      Notiflix.Loading.remove();
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);
  return (
    <>
      <NavbarScreen />
      <Container
        className="bg-white container content"
        style={{ marginTop: "4%" }}
      >
        <h5 className="component">
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
          User Management
        </h5>
        <Tabs
          onSelect={(k) => {
            setKey(k);
          }}
          activeKey={key}
        >
          <Tab eventKey="list" title="Registered users">
            <All />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};
export default Workers;
