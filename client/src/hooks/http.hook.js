import { useState, useCallback } from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(
        async (url, method = 'GET', bodyIn, headersIn = {}) => {
            setLoading(true)
            try {
                let body = null
                let headers = { ...headersIn }
                if (bodyIn) {
                    body = JSON.stringify(bodyIn)
                    headers['Content-Type'] = 'application/json'
                }
                const response = await fetch(url, { method, body, headers })
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Что-то пошло не так')
                }

                setLoading(false)

                return data
            } catch (err) {
                setLoading(false)
                setError(err.message)
                throw err
            }
        },
        []
    )

    const clearError = useCallback(() => setError(null), [])

    return { loading, request, error, clearError }
}