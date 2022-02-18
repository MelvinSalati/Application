import React, { useEffect } from "react";
import FilterableTable from "react-filterable-table";
import API_REQUEST from "../../requestHandler";
const PendingAppointments = () => {
  const [doNotTrack, setDoNotTrack] = React.useState([]);
  useEffect(() => {
    //define hmis
    let hmis = sessionStorage.getItem("hmis");
    async function doNotTrack() {
      const request = await API_REQUEST.get(
        `api/v1/facility/appointments/pending/transfers/${hmis}`
      );
      setDoNotTrack(request.data.list);
      //   console.log(request.data.list);
    }
    doNotTrack();
  }, []);

  const status = (props) => {
    return (
      <>
        <span></span>
        <span className="text-primary">
          <strong>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-exclamation-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>{" "}
            {props.record.Comment}
          </strong>
        </span>
      </>
    );
  };

  const fields = [
    { name: "SN", displayName: "SN", inputFilterable: true },
    {
      name: "Art_Number",
      displayName: "Art Number",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Unique_ID",
      displayName: "Unique_ID",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "First_Name",
      displayName: "First Name",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Last_Name",
      displayName: "Last Name",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Age/Sex",
      displayName: "Age/Sex",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Last_Visit",
      displayName: "Visited On",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Appointment Type",
      displayName: "Appointment Type",
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
    {
      name: "Comment",
      displayName: "Status",
      render: status,
      inputFilterable: true,
      exactFilterable: true,
      sortable: true,
    },
  ];
  return (
    <>
      <h5 className="component">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          class="bi bi-inbox-fill"
          viewBox="0 0 16 16"
        >
          <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z" />
        </svg>
        {"  "}
        Not to be tracked !
      </h5>
      <FilterableTable
        className="table-bordered"
        data={doNotTrack}
        fields={fields}
        pageSize={8}
        pageSizes={false}
        topPagerVisible={false}
      />
    </>
  );
};
export default PendingAppointments;
