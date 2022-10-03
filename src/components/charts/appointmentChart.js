import React, { useState } from "react";
// import { Bar } from "react-chartjs-2";
import { useEffect, useCallback } from "react";
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
  // ComposedChart,
  // Line,
  // Area,
  // ResponsiveContainer,
  // PieChart,
  // Pie,
  // Sector,
} from "recharts";

const BarCharts = () => {
  // const renderActiveShape = (props: any) => {
  //   const RADIAN = Math.PI / 180;
  //   const {
  //     cx,
  //     cy,
  //     midAngle,
  //     innerRadius,
  //     outerRadius,
  //     startAngle,
  //     endAngle,
  //     fill,
  //     payload,
  //     percent,
  //     value,
  //   } = props;
  //   const sin = Math.sin(-RADIAN * midAngle);
  //   const cos = Math.cos(-RADIAN * midAngle);
  //   const sx = cx + (outerRadius + 10) * cos;
  //   const sy = cy + (outerRadius + 10) * sin;
  //   const mx = cx + (outerRadius + 30) * cos;
  //   const my = cy + (outerRadius + 30) * sin;
  //   const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  //   const ey = my;
  //   const textAnchor = cos >= 0 ? "start" : "end";

  //   return (
  //     <g>
  //       <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
  //         {payload.name}
  //       </text>
  //       <Sector
  //         cx={cx}
  //         cy={cy}
  //         innerRadius={innerRadius}
  //         outerRadius={outerRadius}
  //         startAngle={startAngle}
  //         endAngle={endAngle}
  //         fill={fill}
  //       />
  //       <Sector
  //         cx={cx}
  //         cy={cy}
  //         startAngle={startAngle}
  //         endAngle={endAngle}
  //         innerRadius={outerRadius + 6}
  //         outerRadius={outerRadius + 10}
  //         fill={fill}
  //       />
  //       <path
  //         d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
  //         stroke={fill}
  //         fill="none"
  //       />
  //       <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
  //       <text
  //         x={ex + (cos >= 0 ? 1 : -1) * 12}
  //         y={ey}
  //         textAnchor={textAnchor}
  //         fill="#333"
  //       >{`PV ${value}`}</text>
  //       <text
  //         x={ex + (cos >= 0 ? 1 : -1) * 12}
  //         y={ey}
  //         dy={18}
  //         textAnchor={textAnchor}
  //         fill="#999"
  //       >
  //         {`(Rate ${(percent * 100).toFixed(2)}%)`}
  //       </text>
  //     </g>
  //   );
  // };
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
  const datas = [
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

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <>
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
          <center>
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
          </center>
        </>
      ) : (
        <></>
      )}
      <BarChart width={1284} height={650} data={datas} style={{}}>
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Number" fill="cornflowerblue" barSize={100} />
        {/* <Bar dataKey="Number" fill="#82ca9d" /> */}
      </BarChart>
    </>
  );
};

export default BarCharts;
