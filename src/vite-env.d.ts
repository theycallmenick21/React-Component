/// <reference types="vite/client" />

interface ImportMeta {
    readonly env: {
        readonly VITE_APP_BUILT_ON: string
        readonly VITE_APP_DISPLAY_VERSION: string
        readonly VITE_APP_LAST_COMMIT: string
        readonly VITE_APP_NAME: string
        readonly VITE_APP_VERSION: string
        readonly VITE_CONEXIOM_API_URL: string
        readonly VITE_ENABLE_INTERNAL_LOGIN_PAGE: string
        readonly VITE_HUBCO_API_URL: string
        readonly VITE_INTERNAL_LOGIN_PASSWORD: string
        readonly VITE_INTERNAL_LOGIN_USERNAME: string
        readonly VITE_PUBLIC_URL: string
    }
}
