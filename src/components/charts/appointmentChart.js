import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { useEffect } from "react";
import axios from "../../requestHandler";
import Chart from "chart.js/auto";
import { cleanup } from "@testing-library/react";

const BarChart = () => {
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

  const hmis = sessionStorage.getItem("hmis");
  // set data
  const [barData, setBarData] = useState({
    labels: [
      "Scheduled",
      "Reminded",
      "Missed",
      "Returned",
      "Tracked",
      "Not tracked",
    ],
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
    datasets: [
      {
        label: "Number #",
        data: [scheduled, reminded, missed, returned, tracked, notTracked],
        backgroundColor: ["#569afe", "#569afe", "#569afe", "#569afe"],
        borderWidth: 0,
      },
    ],
  });
  // set options
  const [barOptions, setBarOptions] = useState({
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      title: {
        display: true,
        text: "Data Orgranized In Bars",
        fontSize: 25,
      },
      legend: {
        display: true,
        position: "top",
      },
    },
  });

  useEffect(() => {
    async function getWeeklyData() {
      const request = await axios.get(`api/v1/facility/weekly/reports/${hmis}`);

      setScheduled(request.data[0].scheduled);
      setTracked(request.data[0].tracked);
      setMissed(request.data[0].missed);
      setReturned(request.data[0].returned);
      setPending(request.data[0].pending);
      setNotTracked(request.data[0].nottracked);
      setReminded(request.data[0].reminded);
      sessionStorage.setItem("scheduled", request.data[0].scheduled);
      sessionStorage.setItem("reminded", request.data[0].reminded);
      sessionStorage.setItem("missed", request.data[0].missed);
      sessionStorage.setItem("returned", request.data[0].returned);
      sessionStorage.setItem("tracked", request.data[0].tracked);
      sessionStorage.setItem("nottracked", request.data[0].nottracked);
      sessionStorage.setItem("pending", request.data[0].pending);
    }
    getWeeklyData();
    return () => {
      // updateData();
    };
  }, []);
  return (
    <>
      <center>
        {" "}
        <Bar
          data={barData}
          options={barOptions}
          redraw={false}
          className="bar"
        />
      </center>
    </>
  );
};

export default BarChart;
