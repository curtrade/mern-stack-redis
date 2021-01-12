import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { InitPage } from './pages/InitPage'
import { LinksPage } from './pages/LinksPage'
import { CreatePage } from './pages/CreatePage'
import { DetailPage } from './pages/DetailPage'
import { SettingsPage } from './pages/SettingsPage'

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/settings" exact>
                    <SettingsPage />
                </Route>
                <Route path="/links" exact>
                    <LinksPage />
                </Route>
                <Route path="/create" exact>
                    <CreatePage />
                </Route>
                <Route path="/detail/:id">
                    <DetailPage />
                </Route>
                <Redirect to="/create" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route>
                <InitPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}
