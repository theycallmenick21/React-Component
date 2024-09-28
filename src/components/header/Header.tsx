import { AutoAwesome } from '@mui/icons-material'
import { Autocomplete, Grid, InputAdornment, TextField, useTheme } from '@mui/material'
import { ReactNode } from 'react'

import { getAutoCompleteStyles, getContainerStyles } from './Header.styles'
import HeaderTitle from './HeaderTitle'

interface HeaderProps {
    icon: ReactNode
    title: string
}

export const Header = ({ title, icon }: HeaderProps) => {
    const theme = useTheme()

    return (
        <Grid container sx={(theme) => getContainerStyles(theme)}>
            <HeaderTitle icon={icon} title={title} />
            <Autocomplete
                disablePortal
                options={[]}
                renderInput={() => (
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AutoAwesome sx={{ color: theme.palette.warning.main }} />
                                </InputAdornment>
                            ),
                            sx: {
                                padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)} !important`,
                            },
                        }}
                        placeholder="Ask a question about your data..."
                        sx={getAutoCompleteStyles(theme)}
                    />
                )}
                sx={{ border: 'none', height: theme.spacing(8), width: '100%' }}
            />
        </Grid>
    )
}

export default Header
