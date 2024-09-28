import axios, { AxiosResponse } from 'axios'

import { useAppState } from '../states/UseAppState'
import { generateGUID, getCookie, setCookie } from './common'

const setAxiosInterceptors = () => {
    axios.interceptors.request.use(async (config) => {
        const state = useAppState.getState()
        const accessToken = state.accessToken
        const refreshToken = state.refreshToken

        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
        if (refreshToken) config.headers.Refresh = `${refreshToken}`

        // set device ID
        let deviceId = getCookie('DeviceId')
        if (!deviceId) {
            deviceId = generateGUID()
            setCookie('DeviceId', deviceId, 720)
        }
        config.headers.DeviceId = deviceId

        return config
    })

    axios.interceptors.response.use(
        async (response): Promise<AxiosResponse<unknown>> => {
            const state = useAppState.getState()
            const newAccessToken = response.headers['x-access-token']
            const newRefreshToken = response.headers['x-refresh-token']

            if (newAccessToken) state.updateTokens?.(newAccessToken, newRefreshToken)

            return response
        },
        async (error): Promise<AxiosResponse<unknown>> => {
            const expired = error?.response?.headers['x-refresh-token-expired'] === 'true'
            if (expired) {
                const state = useAppState.getState()
                state.setSessionExpired?.()
            }

            throw error
        },
    )
}

export const setupAxios = {
    setAxiosInterceptors: setAxiosInterceptors,
}
