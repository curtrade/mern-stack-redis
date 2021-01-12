import { useState, useCallback, useEffect } from 'react'

const storageName = 'userData'

export const useSession = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)

    const init = useCallback((newToken, newUserId) => {
        setToken(newToken)
        setUserId(newUserId)

        localStorage.setItem(
            storageName,
            JSON.stringify({
                user: { userId: newUserId, token: newToken }
            })
        )
    }, [])

    const clear = useCallback(() => {
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.user) {
            init(data.user.token, data.user.userId)
        }
        setReady(true)
    }, [init])

    return { init, clear, token, userId, ready }
}
