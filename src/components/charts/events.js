import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { useEffect } from "react";
import axios from "../../requestHandler";

const BarChart = () => {
  //appointments
  const [scheduled, setScheduled] = React.useState(
    sessionStorage.getItem("treatment")
  );
  const [reminded, setReminded] = React.useState(
    sessionStorage.getItem("reactivation")
  );
  const [missed, setMissed] = React.useState(
    sessionStorage.getItem("transferout")
  );
  const [returned, setReturned] = React.useState(
    sessionStorage.getItem("transferin")
  );
  const [pending, setPending] = React.useState({});

  const hmis = sessionStorage.getItem("hmis");
  // set data
  const [barData, setBarData] = useState({
    labels: [
      "Treatment Interruptions",
      "Reactivations",
      "Transfers Out /Loses (-) ",
      "Transfers In / Gains (+ )",
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
        data: [scheduled, reminded, missed, returned],
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

  // const updateData = (chart, label, data) => {
  //   chart.data.labels.push(label);
  //   chart.data.datasets.forEach((dataset) => {
  //     dataset.data.push(data);
  //   });
  //   chart.update();
  // };

  useEffect(() => {
    async function getWeeklyData() {
      const request = await axios.get(
        `api/v1/facility/weekly/reports/events/${hmis}`
      );

      setScheduled(request.data[0].treatment);
      // setTracked(request.data[0].tracked)
      setMissed(request.data[0].reactivations);
      setReturned(request.data[0].transferout);
      setPending(request.data[0].transferin);
      // setNotTracked(request.data[0].nottracked);
      setReminded(request.data[0].reminded);
      sessionStorage.setItem("treatment", request.data[0].treatment);
      sessionStorage.setItem("reactivations", request.data[0].reactivations);
      sessionStorage.setItem("transferout", request.data[0].transferout);
      sessionStorage.setItem("transferin", request.data[0].transferin);
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
