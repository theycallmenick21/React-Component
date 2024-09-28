import { Box, Card, CardActions } from '@mui/material'

import CardBody from './CardBody'
import CardButton from './CardButton'

type IconCardProps = {
    buttonText: string
    cardIcon: JSX.Element
    cardText: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleClick: (event?: any) => void
}

const cardStylingWithBorder = {
    borderRadius: 0,
    marginTop: 2,
    minWidth: 275,
}

export default function IconCard({ cardText, cardIcon, buttonText, handleClick }: IconCardProps) {
    return (
        <Card sx={cardStylingWithBorder}>
            <Box>
                <CardBody cardIcon={cardIcon} cardText={cardText} />
                <CardActions sx={{ justifyContent: 'flex-end', padding: '24px' }}>
                    <CardButton buttonText={buttonText} handleClick={handleClick} />
                </CardActions>
            </Box>
        </Card>
    )
}
