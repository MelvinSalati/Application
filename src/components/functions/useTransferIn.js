import React, { useEffect } from 'react'
import axios from '../../requestHandler'

const useTransferIn = () => {
  const [transferData, setTransferData] = React.useState([])
  const hmis = sessionStorage.getItem('hmis')
  useEffect(() => {
    async function getTransferIn() {
      const request = await axios.get(`/api/v1/facility/transferin/${hmis}`)
      setTransferData(request.data.list)
    }
    //get
    getTransferIn()
  }, [])

  return [transferData]
}

export default useTransferIn
