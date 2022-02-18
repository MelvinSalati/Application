import React, { useState } from "react";
// import { Bar } from "react-chartjs-2";
import { useEffect } from "react";
import axios from "../../requestHandler";
import { Audio } from "react-loader-spinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const BarCharts = () => {
  //appointments
  const [scheduled, setScheduled] = React.useState(
    sessionStorage.getItem("scheduled")
  );
  const [reminded, setReminded] = React.useState(
    sessionStorage.getItem("reminded")
  );
  const [missed, setMissed] = React.useState(sessionStorage.getItem("missed"));
  const [returned, setReturned] = React.useState(
    sessionStorage.getItem("returned")
  );
  const [tracked, setTracked] = React.useState(
    sessionStorage.getItem("tracked")
  );
  const [notTracked, setNotTracked] = React.useState(
    sessionStorage.getItem("nottracked")
  );
  const [pending, setPending] = React.useState({});
  const [dataRange, setDataRange] = React.useState("1");
  const [selectDataRange, setSelectDataRange] = React.useState("1");
  const [isLoading, setIsLoading] = React.useState(false);
  const hmis = sessionStorage.getItem("hmis");

  // reset the chart data to Zero Point
  const resetChart = () => {
    setScheduled("0");
    setTracked("0");
    setMissed("0");
    setReturned("0");
    setPending("0");
    setNotTracked("0");
    setReminded("0");
  };
  useEffect(() => {
    async function getChartData() {
      //loading the chart
      setIsLoading(true);
      resetChart();

      const request = await axios.get(
        `api/v1/facility/weekly/reports/${selectDataRange}/${hmis}`
      );
      setScheduled(request.data[0].scheduled);
      setTracked(request.data[0].tracked);
      setMissed(request.data[0].missed);
      setReturned(request.data[0].returned);
      setPending(request.data[0].pending);
      setNotTracked(request.data[0].nottracked);
      setReminded(request.data[0].reminded);
      setIsLoading(false);
    }
    getChartData();
    return () => {
      // updateData();
    };
  }, [hmis, selectDataRange]);
  const data = [
    {
      name: " Scheduled",
      Number: scheduled,
    },
    {
      name: "Reminded by SMS",
      Number: reminded,
    },
    {
      name: "Missed",
      Number: missed,
    },
    {
      name: "Returned ",
      Number: returned,
    },
    {
      name: "Tracked",
      Number: tracked,
    },
    {
      name: "No Tracking",
      Number: notTracked,
    },
  ];

  return (
    <>
      <center>
        <div className="row bg-charts">
          <div className="col-md-6"></div>
          <div className="col-md-3"></div>
          <div className="col-md-3">
            <select
              onChange={(e) => {
                setSelectDataRange(e.target.value);
              }}
              className="form-control"
              style={{ margin: "5px" }}
            >
              <optgroup label="Period">
                <option value="1">Daily</option>
                <option value="2">Weekly</option>
              </optgroup>
            </select>{" "}
          </div>
        </div>
        {/* <Bar
          data={barData}
          options={barOptions}
          redraw={false}
          className=
          "bar"
        /> */}
        {isLoading ? (
          <>
            {" "}
            <span
              style={{
                width: "150px",
                height: "150px",
                background: "#F4F4F4",
                padding: "20px",
                position: "absolute",
                top: "460px",
                borderRadius: "15px",
              }}
              className="border"
            >
              <Audio
                height="100"
                width="100"
                color="#569AFE"
                ariaLabel="loading"
              />
              <strong>Loading..</strong>
              <br />
            </span>
          </>
        ) : (
          <></>
        )}
        <BarChart
          width={1114}
          height={680}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Number" fill="#569AFE" />
          {/* <Bar dataKey="Number" fill="#82ca9d" /> */}
        </BarChart>
        <h5>Retention Indicators</h5>
      </center>
    </>
  );
};

export default BarCharts;
