import '@testing-library/jest-dom'

import axios from 'axios'
import { ComponentProps } from 'react'
import { Trans } from 'react-i18next'
import { beforeAll, vi } from 'vitest'

// mock axios for all the tests
const mockAxiosGet = vi.fn()
const mockAxiosPost = vi.fn()
const mockAxiosPut = vi.fn()
const mockAxiosDelete = vi.fn()

vi.mock('axios')
axios.get = mockAxiosGet.bind(axios)
axios.post = mockAxiosPost.bind(axios)
axios.put = mockAxiosPut.bind(axios)
axios.delete = mockAxiosDelete.bind(axios)

// mock localization
vi.mock('i18next', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual: any = await vi.importActual('i18next')
    return {
        ...actual,
        Trans: ({ i18nKey }: ComponentProps<typeof Trans>) => i18nKey,
        t: (str: string) => str,
    }
})

vi.mock('react-i18next', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual: any = await vi.importActual('react-i18next')
    return {
        ...actual,
        Trans: ({ i18nKey }: ComponentProps<typeof Trans>) => <div>{i18nKey}</div>,
        useTranslation: () => ({ ...actual.useTranslation, t: (str: string) => str }),
    }
})

beforeAll(() => {
    mockAxiosGet.mockResolvedValue({ data: {} })
    mockAxiosPost.mockResolvedValue({ data: {} })
    mockAxiosPut.mockResolvedValue({ data: {} })
    mockAxiosDelete.mockResolvedValue({ data: {} })
})
