import React from "react";
import FilterableTable from "react-filterable-table";
import useTreatment from "../functions/useTreatment";

const TreatmentInteruptions = () => {
  const [data, setData] = useTreatment([]);
  return (
    <>
      <h5 className="component h6">
        <i className="fas fa-pills"></i>
        {"    "}
        Treatment discontinuation
      </h5>
      <FilterableTable
        data={data}
        pageSize={8}
        pageSizes={false}
        topPagerVisible={false}
      />
    </>
  );
};
export default TreatmentInteruptions;
