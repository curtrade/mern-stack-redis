import { useState, useCallback, useEffect } from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)

    const login = useCallback((newToken, newUserId) => {
        setToken(newToken)
        setUserId(newUserId)

        localStorage.setItem(
            storageName,
            JSON.stringify({
                user: { userId: newUserId, token: newToken }
            })
        )
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.user) {
            login(data.user.token, data.user.userId)
        }
        setReady(true)
    }, [login])

    return { login, logout, token, userId, ready }
}
