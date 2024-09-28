import { Alert, AlertProps, Snackbar, SnackbarCloseReason, SnackbarProps } from '@mui/material'
import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'

type NotificationContextActions = {
    showErrorMessage: (message: NotificationProps) => void
    showSuccessMessage: (message: NotificationProps) => void
}

type NotificationProps = Pick<SnackbarProps, 'onClose'> & { message: string }

const AUTO_HIDE_DURATION = 6000

const NotificationContext = createContext<NotificationContextActions>({
    showErrorMessage: () => undefined,
    showSuccessMessage: () => undefined,
})

const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState<AlertProps['severity']>()
    const [onClose, setOnCloseEventhandler] = useState<NotificationProps['onClose']>()

    const showErrorMessage = (snackbarProps: NotificationProps) => {
        setOpen(true)
        setMessage(snackbarProps.message)
        setOnCloseEventhandler(snackbarProps.onClose)
        setSeverity('error')
    }

    const showSuccessMessage = (snackbarProps: NotificationProps) => {
        setOpen(true)
        setMessage(snackbarProps.message)
        setOnCloseEventhandler(snackbarProps.onClose)
        setSeverity('success')
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
        if (onClose) onClose(event, reason)
        setOpen(false)
    }

    return (
        <NotificationContext.Provider value={{ showErrorMessage, showSuccessMessage }}>
            <Snackbar autoHideDuration={AUTO_HIDE_DURATION} open={open} onClose={handleClose}>
                <Alert severity={severity} sx={{ width: '100%' }} variant="filled" onClose={(e) => handleClose(e, 'clickaway')}>
                    {message}
                </Alert>
            </Snackbar>
            {children}
        </NotificationContext.Provider>
    )
}

const useNotification = () => {
    const contxt = useContext(NotificationContext)

    if (!contxt) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }

    return contxt
}

export { NotificationProvider, useNotification }
