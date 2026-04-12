import axios from 'axios'

const BASE_URL = 'http://localhost:8000/api'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds — model inference takes time
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
    console.log('Sending to backend:', file.name, file.type, file.size, 'bytes')
    const response = await client.post('/image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        console.log('Upload progress:', Math.round(e.loaded / e.total * 100) + '%')
      }
    })
    console.log('Backend response:', response.data)
    return response.data
  } catch (err) {
    console.error('analyzeImage error:', err.response?.data || err.message)
    throw err
  }
}