import './App.css'
import './utils/i18n'

import { ThemeProvider } from '@mui/material'
import { FC, useEffect } from 'react'
import { QueryClientProvider } from 'react-query'
import { Route, Switch } from 'react-router-dom'

import { WidgetContext } from './components/context/WidgetConext'
import theme from './components/Themes/navigator'
import { Routes } from './consts/Routes'
import Home from './pages/Home/Home'
import Version from './pages/Version/Version'
import { NotificationProvider } from './providers/notification'
import { queryClient } from './states/QueryClient'
import { useAppState } from './states/UseAppState'
import { setupAxios } from './utils/setupAxios'

setupAxios.setAxiosInterceptors()

interface Props {
    accessToken: string
    changeHubco: (hubCoId: string) => void
    hubCoId: string
    hubCoName: string
    language: string
    refreshToken: string
    setSessionExpired: () => void
    updateTokens: (accessToken: string, refreshToken: string) => void
}
const App_Export: FC<Props> = ({ accessToken, hubCoId, refreshToken, updateTokens, setSessionExpired }) => {
    useEffect(() => {
        useAppState.setState({
            accessToken,
            hubCoId,
            refreshToken,
            setSessionExpired,
            updateTokens,
        })
    }, [accessToken, hubCoId, refreshToken, setSessionExpired, updateTokens])

    return (
        <>
            <ThemeProvider theme={theme}>
                <WidgetContext>
                    <QueryClientProvider client={queryClient}>
                        <NotificationProvider>
                            <Switch>
                                <Route path={Routes.VERSION}>
                                    <Version />
                                </Route>
                                {<Route path="/">{<Home />}</Route>}

                                <Route path="*">
                                    <h1>403 Forbidden</h1>
                                </Route>
                            </Switch>
                        </NotificationProvider>
                    </QueryClientProvider>
                </WidgetContext>
            </ThemeProvider>
        </>
    )
}
export default App_Export
