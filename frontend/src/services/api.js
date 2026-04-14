import axios from 'axios'

const BASE_URL = 'https://remarkable-passion-production-c6b4.up.railway.app/api'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
})

export const analyzeContent = async (text) => {
  const res = await client.post('/analyze/', { text })
  return res.data
}