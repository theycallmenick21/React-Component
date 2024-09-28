/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, vi } from 'vitest'

import Home from './Home'

const renderWithRouter = (ui: any, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route)

    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: BrowserRouter }),
    }
}

vi.mock('../Home/LandingPage', () => ({
    __esModule: true,
    default: () => <div>LandingPage</div>,
}))

describe('Home', () => {
    it('renders without error', () => {
        renderWithRouter(<Home />, { route: '/' })
        expect(screen.getByText('LandingPage')).toBeInTheDocument()
    })
})
