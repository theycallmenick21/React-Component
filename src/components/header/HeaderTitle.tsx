import { Container, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'

interface HeaderTitleProps {
    icon: ReactNode
    title: string
}

const HeaderTitle = ({ title, icon }: HeaderTitleProps) => {
    const { palette, spacing, typography } = useTheme()

    return (
        <Container
            disableGutters
            sx={{
                alignItems: 'center',
                container: {
                    paddingLeft: '0 !important',
                },
                display: 'flex',
                gap: spacing(0.5),
                paddingLeft: '0',
            }}
        >
            {icon}
            <Typography
                component="h3"
                sx={{ color: palette.common.white, fontFamily: 'Rubik', fontSize: typography.h3, fontWeight: typography.fontWeightRegular }}
            >
                {title}
            </Typography>
        </Container>
    )
}

export default HeaderTitle
