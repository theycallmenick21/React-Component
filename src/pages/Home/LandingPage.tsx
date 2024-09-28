import { Typography } from '@mui/material'
import { FC } from 'react'

const LandingPage: FC = () => {
    return (
        <>
            <Typography color={(style) => style.palette.common.black} data-testid="main-app-title" fontSize="2rem" fontWeight={300}>
                Hello World!
            </Typography>
            <Typography>Welcome to {import.meta.env.VITE_APP_NAME}. </Typography>
            <Typography>Please read the README file to setup this project with Partner Portal.</Typography>
        </>
    )
}

export default LandingPage
