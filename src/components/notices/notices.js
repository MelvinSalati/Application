import React, { useEffect } from "react";
import Avatar from "react-avatar";
import FormControl from "react-bootstrap/FormControl";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/esm/Container";
import FilterableTable from "react-filterable-table";
import axios from "../../requestHandler";
import Axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
// import env from
// import Messagebox from "./Messagebox";

const Notices = () => {
  // messages
  // 1
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState([]);
  useEffect(() => {
    // 2
    Axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
    // 3
    const echo = new Echo({
      broadcaster: "pusher",
      key: process.env.REACT_APP_MIX_ABLY_PUBLIC_KEY,
      wsHost: "realtime-pusher.ably.io",
      wsPort: 443,
      disableStats: true,
      encrypted: true,
    });
    // 4
    echo
      .channel("public.room")
      .subscribed(() => {
        console.log("You are subscribed");
      })
      // 5
      .listen(".message.new", (data) => {
        // 6
        setMessages((oldMessages) => [...oldMessages, data]);
        setMessage("");
      });
  }, []);
  const hmis = sessionStorage.getItem("hmis");
  const [data, setData] = React.useState([]);
  useEffect(() => {
    async function getNotifications() {
      const request = await axios.get(
        `api/v1/facility/notifications/new/${hmis}`
      );
      setData(request.data.notifications);
      console.log(request.data);
    }

    getNotifications();
  }, []);

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
  ];
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
        <Container style={{ height: "540px" }}>
          {/* <FilterableTable
            data={data}
            fields={fields}
            pageSize={6}
            pageSizes={false}
            topPagerVisible={false}
          /> */}
          {data}
        </Container>
      </center>
    </>
  );
};
export default Notices;
