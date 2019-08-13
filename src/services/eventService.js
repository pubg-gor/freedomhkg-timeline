import axios from 'axios'

export const getEvents = async query => {
  const response = await axios.get('/api/events', { params: query })
  return response.data
}

export const createEvent = async data => {
  return axios.post('/api/events', data)
}
