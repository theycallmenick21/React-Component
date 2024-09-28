import { PaletteColor } from '@mui/material'

declare module '@mui/material/styles' {
    interface Palette {
        blue: PaletteColor
        customGrey: PaletteColor
        tertiary: PaletteColor
        turquoise: PaletteColor
    }
    interface PaletteOptions {
        blue: PaletteColor
        customGrey: PaletteColor
        tertiary: PaletteColor
        turquoise: PaletteColor
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        customGrey: true
        tertiary: true
    }
}
