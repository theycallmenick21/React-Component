import { Button, SxProps } from '@mui/material'
import { SyntheticEvent } from 'react'

type CardButtonProps = {
    buttonStyling?: SxProps
    buttonText: string
    handleClick: (event: SyntheticEvent) => void
}

const blueButtonStyling = {
    '&:hover': {
        backgroundColor: '#0D47A1', // same as non-hover state
    },
    backgroundColor: '#0D47A1',
    color: 'white',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '500',
    height: '36px',
    width: '123px',
}

export default function CardButton({ buttonText, handleClick, buttonStyling = {} }: CardButtonProps) {
    return (
        <Button size="small" sx={{ ...blueButtonStyling, ...buttonStyling }} onClick={handleClick}>
            {buttonText}
        </Button>
    )
}
