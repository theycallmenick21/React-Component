import { Box, Card, CardActions, CardContent, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { SyntheticEvent } from 'react'

import CardBody from './CardBody'
import CardButton from './CardButton'

type CheckboxCardProps = {
    bottomText?: string
    buttonText: string
    cardIcon: JSX.Element
    cardText: string
    handleClick: (event?: SyntheticEvent) => void
    spokeCoNames: string[]
}

const cardStylingWithBorder = {
    borderRadius: 0,
    marginTop: 2,
    minWidth: 275,
}

const ignoreButtonStyling = {
    '&:hover': {
        backgroundColor: 'transparent', // same as non-hover state
    },
    backgroundColor: 'transparent',
    color: '#0D47A1',
}

export default function CheckboxCard({ cardText, cardIcon, buttonText, handleClick, spokeCoNames, bottomText = undefined }: CheckboxCardProps) {
    const handleIgnore = (event: SyntheticEvent) => {
        event.stopPropagation()
    }

    return (
        <Card sx={cardStylingWithBorder}>
            <Box>
                <CardBody cardIcon={cardIcon} cardText={cardText} />
                <CardContent>
                    <Box sx={{ alignItems: 'flex-start', display: 'flex' }}>
                        <Box sx={{ height: '64px', marginRight: '16px', width: '64px' }}></Box>
                        <FormGroup>
                            {spokeCoNames.map((spokeCoName, index) => {
                                return <FormControlLabel control={<Checkbox defaultChecked />} key={index} label={spokeCoName} />
                            })}
                        </FormGroup>
                    </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', padding: '24px' }}>
                    <CardButton buttonStyling={ignoreButtonStyling} buttonText="IGNORE" handleClick={handleIgnore} />
                    <CardButton buttonStyling={{ width: '178px' }} buttonText={buttonText} handleClick={handleClick} />
                </CardActions>
                {bottomText && <CardBody cardText={bottomText} iconBoxStyling={{ height: '42px' }} textStyling={{ fontWeight: '600' }} />}
            </Box>
        </Card>
    )
}
