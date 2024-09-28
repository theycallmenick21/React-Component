import axios from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'

import { formatURL } from '../utils/common'

interface LoginResponse {
    Token: {
        access_token: string
        refresh_token: string
    }
    User: {
        HubCoBusinessKey: string
        HubCoName: string
    }
}

const useLogin = (username: string, password: string, options?: UseQueryOptions<LoginResponse[], Error>) => {
    return {
        access: useQuery<LoginResponse[], Error>({
            ...options,
            queryFn: async () => {
                const response = await axios.post<LoginResponse[]>(formatURL({ baseURL: import.meta.env.VITE_CONEXIOM_API_URL, url: '/login' }), {
                    Password: password,
                    Username: username,
                    grantType: 'client_credentials',
                })
                return response.data
            },
            queryKey: ['conexiomApi', 'login'],
        }),
    }
}

export const conexiomAPI = {
    useLogin,
}
