import React from "react";
import Avatar from "react-avatar";
import FormControl from "react-bootstrap/FormControl";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/esm/Container";
import FilterableTable from "react-filterable-table";
const Notices = () => {
  const [data, setData] = React.useState([]);

  const [notifications, setNotifications] = React.useState([]);

  return (
    <>
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
        Notices
      </h1>
      <center>
        <Container style={
            {height: '540px'}
        }>
          <FilterableTable
            data={data}
            pageSize={6}
            pageSizes={false}
            topPagerVisible={false}
          />
        </Container>
      </center>
    </>
  );
};
export default Notices;
