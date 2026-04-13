import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://remarkable-passion-production-c6b4.up.railway.app/api'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
})

export const analyzeContent = async (text) => {
  try {
    const response = await client.post('/analyze/', { text })
    return response.data
  } catch (err) {
    console.error('analyzeContent error:', err.response?.data || err.message)
    throw err
  }
}

export const analyzeImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await client.post('/image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (err) {
    console.error('analyzeImage error:', err.response?.data || err.message)
    throw err
  }
}