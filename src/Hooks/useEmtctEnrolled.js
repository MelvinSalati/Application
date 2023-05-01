import React, { useEffect, useState } from "react";
import axios from "../requestHandler";
export default function useEmtctEnrolled(uuid) {
  const [emtctEnrolled, setEmtctEnrolled] = useState(false);

  useEffect(() => {
    async function checkIfEnrolledInEmtct() {
      await axios.get(`api/v1/emtct/enroll/${uuid}`).then((response) => {
        setEmtctEnrolled(!response.data.status);
        console.log(response.data.status);
      });
    }
    checkIfEnrolledInEmtct();
  });
  return emtctEnrolled;
}
