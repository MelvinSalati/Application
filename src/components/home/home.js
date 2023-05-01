import React, { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/esm/Container";
import Icon from "../icon.jpeg";

import Notiflix from "notiflix";
import Charts from "../charts/charts";

const Home = (props) => {
  //stop loading
  Notiflix.Loading.remove();
  // get url parameters
  const params = props.location.state.details;
  //  setting local variables
  sessionStorage.setItem("hmis", params.hmis);
  sessionStorage.setItem("department", params.department);
  sessionStorage.setItem("name", params.name);
  sessionStorage.setItem("phone", params.phone);
  sessionStorage.setItem("user", params.username);

  return (
    <div>
      <Charts />
    </div>
  );
};
export default Home;
