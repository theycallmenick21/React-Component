import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'

import { GraphType } from '../../enums'

type WidgetData = {
    automationRateData: SpokeCoWidgetData[]
    errorRateData: SpokeCoWidgetData[]
    errorRateMonthData: SpokeCoWidgetData[]
    graphType: GraphType
    month: string
    validationField: string
}

type WidgetReducers = {
    setAutomationRateData: Dispatch<SetStateAction<SpokeCoWidgetData[]>>
    setErrorRateData: Dispatch<SetStateAction<SpokeCoWidgetData[]>>
    setErrorRateMonthData: Dispatch<SetStateAction<SpokeCoWidgetData[]>>
    setGraphType: Dispatch<SetStateAction<GraphType>>
    setMonth: Dispatch<SetStateAction<string>>
    setValidationField: Dispatch<SetStateAction<string>>
}

const WidgetContextData = createContext<WidgetData>({} as WidgetData)
const WidgetContextReducers = createContext<WidgetReducers>({} as WidgetReducers)

type WidgetContextProps = {
    children: ReactNode
}

function WidgetContext({ children }: WidgetContextProps) {
    const [automationRateData, setAutomationRateData] = useState<SpokeCoWidgetData[]>([])
    const [errorRateData, setErrorRateData] = useState<SpokeCoWidgetData[]>([])
    const [errorRateMonthData, setErrorRateMonthData] = useState<SpokeCoWidgetData[]>([])
    const [graphType, setGraphType] = useState<GraphType>(GraphType.AutomationRate)
    const [month, setMonth] = useState<string>('')
    const [validationField, setValidationField] = useState<string>('')

    const reducers: WidgetReducers = useMemo(
        () => ({
            setAutomationRateData,
            setErrorRateData,
            setErrorRateMonthData,
            setGraphType,
            setMonth,
            setValidationField,
        }),
        [],
    )

    return (
        <WidgetContextReducers.Provider value={{ ...reducers }}>
            <WidgetContextData.Provider
                value={{
                    automationRateData,
                    errorRateData,
                    errorRateMonthData,
                    graphType,
                    month,
                    validationField,
                }}
            >
                {children}
            </WidgetContextData.Provider>
        </WidgetContextReducers.Provider>
    )
}

export { WidgetContext, WidgetContextData, WidgetContextReducers }
