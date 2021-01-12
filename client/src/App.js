import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { useSession } from './hooks/session.hook'
import { SessionContext } from './context/SessionContext'
import { Navbar } from './components/Navbar'
import { Loader } from './components/Loader'
import 'materialize-css'

function App() {
    const sessionParams = useSession()

    if (!sessionParams.ready) {
        return <Loader />
    }

    const isSessionAlive = Boolean(sessionParams.token)
    const routes = useRoutes(isSessionAlive)

    return (
        <SessionContext.Provider value={{ ...sessionParams, isSessionAlive }}>
            <Router>
                {isSessionAlive && <Navbar />}
                <div className="container">{routes}</div>
            </Router>
        </SessionContext.Provider>
    )
}

export default App
