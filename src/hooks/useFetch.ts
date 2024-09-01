import { useState, useEffect } from 'react'
import { apiFunctions } from '../services/apiFunctions'

export const useFetch = (endpoint: string, options?: any) => {
  const [data, setData] = useState(null)
  const [loadingFetch, setLoadingFetch] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFunctions[endpoint](options)
        setData(response.data)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoadingFetch(false)
      }
    }
    fetchData()
  }, [endpoint, options])

  return { data, loadingFetch, error }
}
