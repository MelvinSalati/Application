import Axios from 'axios'

const request = Axios.create({
  baseURL: 'http://127.0.0.1:8001/',
})
export default request
