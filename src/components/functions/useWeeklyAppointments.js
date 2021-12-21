import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
// import Swal from "sweetalert2";
import axios from "../../requestHandler";
// import Charts from "./Dashboard";
function Charts(props) {
  const [barData, setBarData] = React.useState({});
  const [barOptions, setBarOptions] = React.useState({});
  const [hmisCode, setHmisCode] = React.useState([]);

  useEffect(() => {
    async function getWeeklyPerformance() {
      const response = await axios.post("api/v1/facility/weekly/reports");
      setBarData({
        labels: [
          "Scheduled Appointments",
          "Reminded Appointments",
          "Missed Appointments",
          "Tracked Appointments",
          "Lost To Follow Up",
          "Reactivations",
          "Returned",
        ],
        datasets: [
          {
            label: "# number",
            data: [
              response.data[0].scheduled,
              response.data[0].reminded,
              response.data[0].missed,
              response.data[0].tracked,
              //   response.data[0].lost,
              //   response.data[0].reactivations,
              response.data[0].returned,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
      // set options
      setBarOptions({
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
    }

    getWeeklyPerformance();
  }, []);

  return (
    <>
      <div className="BarExample">
        <Bar data={barData} options={barOptions} />
      </div>
    </>
  );
}
export default Charts;
