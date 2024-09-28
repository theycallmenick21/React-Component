import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App_Local from './App_Local'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.VITE_PUBLIC_URL}>
            <App_Local />
            {/* <App_Export
        accessToken={'aa'}
        basename={'aa'}
        changeHubco={function (hubCoId: string): void {
          throw new Error('Function not implemented.')
        }}
        hubCoId={'aa'}
        language={'en'}
        portalSubroute={''}
        refreshToken={''}
        setSessionExpired={function (): void {
          throw new Error('Function not implemented.')
        }}
        updateTokens={function (accessToken: string, refreshToken: string): void {
          throw new Error('Function not implemented.')
        }}
      /> */}
        </BrowserRouter>
    </React.StrictMode>,
)
