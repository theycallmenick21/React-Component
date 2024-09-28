import { useTheme } from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import React from 'react'

import { Service, VersionState, VersionType } from './Version.type'

const conexiomApiUrl = import.meta.env.VITE_CONEXIOM_API_URL
const hubCoApiUrl = import.meta.env.VITE_HUBCO_API_URL

// SETUP GUIDE: Add the services you want to display in the version page
export const services: Service[] = [
    {
        data: undefined,
        getVersionUrl: conexiomApiUrl + '/getversion',
        name: 'Conexiom Api',
        showProtectedInformation: true,
        url: conexiomApiUrl,
        versionUrl: conexiomApiUrl + '/version',
    },
    {
        data: undefined,
        getVersionUrl: hubCoApiUrl + '/getversion',
        name: 'HubCo Api',
        showProtectedInformation: true,
        url: hubCoApiUrl,
        versionUrl: hubCoApiUrl + '/version',
    },
]

const Version = () => {
    const theme = useTheme()
    const borderStyle: React.CSSProperties = {
        border: `1px solid ${theme.palette.primary.main}`,
        borderCollapse: 'collapse',
        padding: '3px',
    }
    const [state, setState] = useState<VersionState>({ data: services })

    const removeLastUrlSegment = (url: string) => {
        if (url[url.length - 1] == '/') url = url.substring(0, url.length - 1)

        return url.substring(0, url.lastIndexOf('/'))
    }

    const renderAccessesOn = () => (
        <div>
            <h1>{import.meta.env.VITE_APP_NAME}</h1>
            <h3>
                Accessed on:
                <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>{moment.utc().format('DD-MM-YYYY HH:mm:ss')} UTC</span>
            </h3>
        </div>
    )

    useEffect(() => {
        services.forEach((service, index) => {
            axios.get<VersionType>(service.getVersionUrl).then((res) => {
                const newState = { ...state }
                newState.data[index].data = res.data
                setState(newState)
            })
        })
    }, [services])

    const renderPortalInformation = () => (
        <>
            <tr>
                <td style={borderStyle}>
                    <strong>Application:</strong>
                </td>
                <td style={borderStyle}>{import.meta.env.VITE_APP_NAME}</td>
            </tr>
            <tr>
                <td style={borderStyle}>
                    <strong>Url:</strong>
                </td>
                <td style={borderStyle}>{removeLastUrlSegment(window.location.toString())}</td>
            </tr>
            <tr>
                <td style={borderStyle}>
                    <strong>Version:</strong>
                </td>
                <td style={borderStyle}>
                    {import.meta.env.VITE_APP_VERSION} ({import.meta.env.VITE_APP_DISPLAY_VERSION})
                </td>
            </tr>
            <tr>
                <td style={borderStyle}>
                    <strong>Build On:</strong>
                </td>
                <td style={borderStyle}>{import.meta.env.VITE_APP_BUILT_ON}</td>
            </tr>
            <tr>
                <td style={borderStyle}>
                    <strong>Reference:</strong>
                </td>
                <td style={borderStyle}>{import.meta.env.VITE_APP_LAST_COMMIT}</td>
            </tr>
            <tr>
                <td style={borderStyle}>
                    <strong>Build tool:</strong>
                </td>
                <td style={borderStyle}>Vite.js</td>
            </tr>
        </>
    )

    const renderComponents = () =>
        state.data.map((service, index) => {
            return (
                <React.Fragment key={`service${index}`}>
                    <tr>
                        <td style={borderStyle}>
                            <strong>Application:</strong>
                        </td>
                        <td style={borderStyle}>
                            <a href={service.versionUrl}>{service.name}</a>
                        </td>
                    </tr>
                    {service.showProtectedInformation && (
                        <>
                            <tr>
                                <td style={borderStyle}>
                                    <strong>Deployment:</strong>
                                </td>
                                <td style={borderStyle}>{service.data?.Deployment}</td>
                            </tr>
                            <tr>
                                <td style={borderStyle}>
                                    <strong>PortalId:</strong>
                                </td>
                                <td style={borderStyle}>{service.data?.PortalId}</td>
                            </tr>
                            <tr>
                                <td style={borderStyle}>
                                    <strong>ClientId:</strong>
                                </td>
                                <td style={borderStyle}>{service.data?.ClientId}</td>
                            </tr>
                        </>
                    )}
                    <tr>
                        <td style={borderStyle}>
                            <strong>Url:</strong>
                        </td>
                        <td style={borderStyle}>{service.url}</td>
                    </tr>
                    <tr>
                        <td style={borderStyle}>
                            <strong>Version:</strong>
                        </td>
                        <td style={borderStyle}>{service.data?.FileVersion != null ? `${service.data?.FileVersion} (${service.data?.Version})` : ''}</td>
                    </tr>
                    <tr>
                        <td style={borderStyle}>
                            <strong>Build On:</strong>
                        </td>
                        <td style={borderStyle}>{service.data?.BuildDate != null ? moment(service.data?.BuildDate).format('DD-MM-YYYY HH:mm:ss') : ''}</td>
                    </tr>
                    <tr>
                        <td style={borderStyle}>
                            <strong>Reference:</strong>
                        </td>
                        <td style={borderStyle}>{service.data?.Reference}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ borderCollapse: 'collapse', padding: '10px' }}></td>
                    </tr>
                </React.Fragment>
            )
        })

    return (
        <div>
            {renderAccessesOn()}
            <table style={{ borderCollapse: 'collapse' }}>
                <tbody>
                    {renderPortalInformation()}
                    <tr>
                        <td colSpan={2} style={{ borderCollapse: 'collapse', padding: '10px' }}>
                            <h3 style={{ margin: '0px' }}>Components</h3>
                        </td>
                    </tr>

                    {renderComponents()}
                </tbody>
            </table>
        </div>
    )
}

export default Version
