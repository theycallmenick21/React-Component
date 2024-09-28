import { create } from './utils/zustand'

interface AppState {
    accessToken?: string
    hubCoId: string
    refreshToken?: string
    setSessionExpired?: () => void
    updateTokens?: (accessToken: string, refreshToken: string) => void
}

const initialState: AppState = {
    hubCoId: '',
    // setSessionExpired: () => null,
    // updateTokens: (accessToken: string, refreshToken: string) => console.log(accessToken, refreshToken),
}

// const useAppState = create<AppState>((set) => ({
//     ...initialState,
//     setSessionExpired: () => set((state) => ({ ...state, accessToken: undefined, refreshToken: undefined })),

//     updateTokens: (accessToken: string, refreshToken: string) => set((state) => ({ ...state, accessToken, refreshToken })),
// }))

const useAppState = create<AppState>(() => initialState)

export { initialState, useAppState }
