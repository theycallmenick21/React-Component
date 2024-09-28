import { Box, LinearProgress } from '@mui/material'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'

type LoadingIndicatorActions = {
    clearAllLoadingIndicators: () => void
    hideLoadingIndicator: (id: string) => void
    showLoadingIndicator: () => string
}

const LoadingIndicatorContext = createContext<LoadingIndicatorActions>({
    clearAllLoadingIndicators: () => undefined,
    hideLoadingIndicator: () => undefined,
    showLoadingIndicator: () => '',
})

const LoadingIndicatorProvider: FC<PropsWithChildren> = ({ children }) => {
    const [open, setOpen] = useState<{ [key: string]: boolean }>({})
    const showLoadingIndicator = () => {
        const id = Date.now().toString(36)
        setOpen((prev) => ({ ...prev, [id]: true }))
        return id
    }

    const hideLoadingIndicator = (id: string) =>
        setOpen((prev) => {
            const newOpen = { ...prev }
            delete newOpen?.[id]
            return newOpen
        })

    const clearAllLoadingIndicators = () => {
        setOpen({})
    }

    useEffect(() => {
        console.log(open)
    }, [open])

    return (
        <LoadingIndicatorContext.Provider value={{ clearAllLoadingIndicators, hideLoadingIndicator, showLoadingIndicator }}>
            <Box sx={{ height: 5 }}>
                {Object.values(open).some((v) => v) && (
                    <LinearProgress
                        sx={(style) => ({
                            left: 0,
                            position: 'relative',
                            right: 0,
                            top: 0,
                            zIndex: style.zIndex.drawer + 1,
                        })}
                    />
                )}
            </Box>
            {children}
        </LoadingIndicatorContext.Provider>
    )
}

const useLoadingIndicator = () => {
    const contxt = useContext(LoadingIndicatorContext)

    if (!contxt) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }

    return contxt
}

export { LoadingIndicatorProvider, useLoadingIndicator }
