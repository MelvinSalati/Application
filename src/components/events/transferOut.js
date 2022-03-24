import React from "react";
import FilterableTable from "react-filterable-table";
import useTransferOut from "../functions/useTransferOut";
const TransferOut = () => {
  const [data, setData] = useTransferOut([]);

  //table props

  const tableBtn = (props) => {
    return (
      <>
        {props.record.Status === "Notified" ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="text-success bi bi-envelope-check-fill"
              viewBox="0 0 16 16"
            >
              <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 4.697v4.974A4.491 4.491 0 0 0 12.5 8a4.49 4.49 0 0 0-1.965.45l-.338-.207L16 4.697Z" />
              <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z" />
            </svg>
            {"  "} Notified
          </>
        ) : (
          <></>
        )}
      </>
    );
  };
  const tableFields = [
    { name: "SN", displayName: "SN", inputFilterable: true },
    { name: "Art Number", displayName: "Art Number", inputFilterable: true },
    { name: "Unique ID", displayName: "Unique ID", inputFilterable: true },
    { name: "First Name", displayName: "First Name", inputFilterable: true },
    { name: "Last Name", displayName: "Last Name", inputFilterable: true },
    {
      name: "Receiving Facility",
      displayName: "Receiving Facility",
      inputFilterable: true,
    },
    {
      name: "Date Transfered",
      displayName: "Date Transfered",
      inputFilterable: true,
    },
  ];
  return (
    <>
      <h5 className="component text-secondary" style={{ marginBottom: "10px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-cloud-arrow-up-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z" />
        </svg>
        {"    "}
        Outgoing Recipients
      </h5>
      <FilterableTable
        data={data}
        fields={tableFields}
        pageSize={8}
        pageSizes={false}
        topPagerVisible={false}
      />
    </>
  );
};
export default TransferOut;
