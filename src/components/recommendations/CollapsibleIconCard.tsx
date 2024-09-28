import { Box, Card, CardActions, Collapse } from '@mui/material'
import { SyntheticEvent, useState } from 'react'

import CardBody from './CardBody'
import CardButton from './CardButton'

type CollapsibleCardProps = {
    buttonText: string
    cardIcon: JSX.Element
    cardText: string
    handleClick: (event?: SyntheticEvent) => void
}

const cardStylingWithBorder = {
    borderRadius: 0,
    marginTop: 2,
    minWidth: 275,
}

const cardStylingWithNoBorder = {
    borderRadius: 0,
    boxShadow: 'none',
    marginTop: 2,
    minWidth: 275,
}

const cancelButtonStyling = {
    '&:hover': {
        backgroundColor: 'transparent', // same as non-hover state
    },
    backgroundColor: 'transparent',
    color: '#0D47A1',
}

export default function CollapsibleCard({ cardText, cardIcon, buttonText, handleClick }: CollapsibleCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const handleCancel = (event?: SyntheticEvent) => {
        event?.stopPropagation()
        setIsExpanded(false)
    }

    return (
        <Card sx={!isExpanded ? cardStylingWithNoBorder : cardStylingWithBorder}>
            <Box
                onClick={() => {
                    setIsExpanded(!isExpanded)
                }}
            >
                <CardBody cardIcon={cardIcon} cardText={cardText} />
                <Collapse in={isExpanded}>
                    <CardActions sx={{ justifyContent: 'flex-end', padding: '24px' }}>
                        <CardButton buttonStyling={cancelButtonStyling} buttonText="CANCEL" handleClick={handleCancel} />
                        <CardButton buttonText={buttonText} handleClick={handleClick} />
                    </CardActions>
                </Collapse>
            </Box>
        </Card>
    )
}
