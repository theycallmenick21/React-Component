import { createTheme } from '@mui/material'

const { palette } = createTheme()
const navigatorTheme = createTheme({
    palette: {
        blue: palette.augmentColor({ color: { light: '#F5F5F5', main: '#3B5D75' } }),
        customGrey: palette.augmentColor({ color: { light: '#F5F5F5', main: '#E0E0E0' } }),
        primary: { main: '#0D47A1' },
        secondary: { main: '#A1660D' },
        tertiary: palette.augmentColor({ color: { main: '#095B5F' } }),
        turquoise: palette.augmentColor({ color: { main: '#7FDCE8' } }),
        warning: { main: '#EB7312' },
    },
})

export default navigatorTheme
