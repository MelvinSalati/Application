import React from "react";
import Authentication from "./components/auth/authentication";
import ScheduledScreen from "./components/appointments/ScheduledScreen";
import Home from "./components/home/home";
import Notices from "./components/notices/notices";
import Events from "./components/events/events";
import Tracking from "./components/tracking/tracking";
import Report from "./components/reports/reports";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import Workers from "./components/workers/workers";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ClientDetailsScreen from "./components/clients/ClientDetailsScreen";
import Search from "./components/search/searchResults";
import Charts from "./components/charts/charts";
import "./App.css";
function App() {
  return (
    <>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Authentication} />
          <Route exact path="/app" component={Home} />
          <Route exact path="/dashboard" component={Charts} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/client/profile" component={ClientDetailsScreen} />
          <Route exact path="/scheduled" component={ScheduledScreen} />
          <Route exact path="/events" component={Events} />
          <Route exact path="/notices" component={Notices} />
          <Route exact path="/tracking" component={Tracking} />
          <Route exact path="/reports" component={Report} />
          <Route exact path="/workers" component={Workers} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
