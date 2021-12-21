import React from 'react'
import axios from '../../requestHandler'
import { useEffect } from 'react'

const useMissedAppointments = (appointmentDate) => {
  const [appointments, setAppointments] = React.useState([])
  const hmis = sessionStorage.getItem('hmis')
  useEffect(() => {
    async function getAppointments() {
      const request = await axios.get(
        `api/v1/facility/appointment/list/${appointmentDate}/${hmis}`,
      )
      setAppointments(request.data.list)
    }

    //get the list of appointments
    getAppointments()
  }, [appointmentDate])

  return [appointments]
}
export default useMissedAppointments
