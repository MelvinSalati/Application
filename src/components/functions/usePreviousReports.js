import React from 'react'
import { useEffect } from 'react'
import axios from '../../requestHandler'

const usePreviousReports = () => {
  const [previous, setPrevious] = React.useState([])
  const hmis = sessionStorage.getItem('hmis')

  useEffect(() => {
    async function getPreviousReport() {
      const request = await axios.get(`api/v1/facility/reports/${hmis}`)
      setPrevious(request.data.reports)
    }
    
    //run
    getPreviousReport()
  }, [hmis])

  return [previous]
}
export default usePreviousReports
