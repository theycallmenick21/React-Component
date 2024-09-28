import { Navigation } from '@mui/icons-material'
import { ThemeProvider } from '@mui/material'
import { render } from '@testing-library/react'

import theme from '../../components/Themes/navigator'
import Header from './Header'

const MOCK_TITLE = 'Navigator'
const MOCK_ICON = <Navigation aria-label="navigator icon" />

const renderComponent = () =>
    render(
        <ThemeProvider theme={theme}>
            <Header icon={MOCK_ICON} title={MOCK_TITLE} />
        </ThemeProvider>,
    )

describe('Header Component', () => {
    it('renders correctly with the given title and icon', () => {
        const { getByText, getByLabelText } = renderComponent()
        expect(getByText('Navigator')).toBeInTheDocument()

        expect(getByLabelText('navigator icon')).toBeInTheDocument()
    })
})
