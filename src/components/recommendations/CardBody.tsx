import { Box, CardContent, SxProps, Typography } from '@mui/material'

type CardBodyProps = {
    cardIcon?: JSX.Element
    cardText: string
    iconBoxStyling?: SxProps
    textStyling?: SxProps
}

const defaultBoxStyle = {
    height: '64px',
    marginRight: '16px',
    width: '64px',
}

const defaultTextStyling = {
    fontFamily: 'Rubik',
    fontSize: '16px',
    fontWeight: '400',
}

export default function CardBody({ cardText, cardIcon, iconBoxStyling, textStyling }: CardBodyProps) {
    return (
        <CardContent>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ ...defaultBoxStyle, ...iconBoxStyling }}>{cardIcon}</Box>
                <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ ...defaultTextStyling, ...textStyling }}>{cardText}</Typography>
                </Box>
            </Box>
        </CardContent>
    )
}
