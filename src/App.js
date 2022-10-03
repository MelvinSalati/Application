import "./App.css";
import Client from "./components/find/Client";
import Authentication from "./components/auth/authentication";
import Scheduled from "./components/appointments/scheduled";
import Home from "./components/home/home";
import Notices from "./components/notices/notices";
import Events from "./components/events/events";
import Tracking from "./components/tracking/tracking";
import Report from "./components/reports/reports";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import Workers from "./components/workers/workers";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {
  return (
    <>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Authentication} />
          <Route exact path="/app" component={Home} />
          <Route exact path="/client" component={Client} />
          <Route exact path="/home" component={Scheduled} />
          <Route exact path="/events" component={Events} />
          <Route exact path="/notices" component={Notices} />
          <Route exact path="/tracking" component={Tracking} />
          <Route exact path="/reports" component={Report} />
          <Route exact path="/wokers" component={Workers} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
