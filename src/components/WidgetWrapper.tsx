import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Button, Grid, Typography } from '@mui/material'
import axios, { AxiosResponse } from 'axios'
import { useContext, useEffect, useRef } from 'react'

import {
    errorRateBenchmarkValues,
    errorRateByMonthBenchmarkValues,
    errorRateByMonthByFieldBenchmarkValues,
    graphDimensions,
    orderAccuracyBenchmarkValues,
} from '../constants'
import { GraphType } from '../enums'
import { toPascalCase } from '../utils/common'
import BarGraphWidget from './BarGraphWidget'
import { WidgetContextData, WidgetContextReducers } from './context/WidgetConext'
import { customLegendForPercentAutomatedBarGraph, customLegendForStackedBarGraph } from './legends/Legends'
import StackedWidget from './StackedWidget'

type RealtimeResponseData = {
    data: OrderAutomationData[]
}

type RealTimeErrorRateResponseData = {
    data: ErrorRateData[]
}

type RealTimeErrorRateByMonthResponseData = {
    data: ErrorRateData[]
    month: string
}

type WidgetProps = {
    hubCoId: string
    widgetId: string
}

type OrderAutomationData = {
    spokeCoId: string
    spokeCoName: string
    value: number
}

type OrderAutomationResponse = {
    HubCoId: string
    data: OrderAutomationData[]
}

type ErrorRateData = {
    label: string
    value: number
}

type ErrorRateResponse = {
    data: ErrorRateData[]
    hubCoId: string
}

const navigatorApiUrl = import.meta.env.VITE_NAVIGATOR_API_URL
const axiosOptions = { withCredentials: false }

const errorRateMonthFieldData = [
    { CustomerErrors: 30, FulfillmentErrors: 15, Label: 'ABC Company', SellerErrors: 10 },
    { CustomerErrors: 15, FulfillmentErrors: 12, Label: 'Stellar Solutions Inc.', SellerErrors: 20 },
    { CustomerErrors: 4, FulfillmentErrors: 14, Label: 'Visionary Ventures Ltd.', SellerErrors: 19 },
    { CustomerErrors: 13, FulfillmentErrors: 2, Label: 'NuTech Supply Ltd.', SellerErrors: 4 },
    { CustomerErrors: 21, FulfillmentErrors: 9, Label: 'Dunphy Logistics', SellerErrors: 3 },
    { CustomerErrors: 11, FulfillmentErrors: 5, Label: 'Finn Building Supply', SellerErrors: 1 },
    { CustomerErrors: 10, FulfillmentErrors: 2, Label: 'Huntington Logistics', SellerErrors: 3 },
    { CustomerErrors: 3, FulfillmentErrors: 9, Label: 'Acme Supply Inc.', SellerErrors: 7 },
    { CustomerErrors: 7, FulfillmentErrors: 7, Label: 'KJS Supply Ltd.', SellerErrors: 2 },
    { CustomerErrors: 5, FulfillmentErrors: 2, Label: 'Yamamoto Inc', SellerErrors: 3 },
    { CustomerErrors: 4, FulfillmentErrors: 2, Label: 'Finlay Building Supply', SellerErrors: 3 },
    { CustomerErrors: 3, FulfillmentErrors: 1, Label: 'Luminious Lab', SellerErrors: 3 },
]

function convertMonthLabels(month: string): string {
    const date = new Date(Number(month.split('-')[0]), Number(month.split('-')[1]) - 1)

    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}

function WidgetWrapper({ hubCoId, widgetId }: WidgetProps) {
    const { automationRateData, errorRateData, errorRateMonthData, graphType, month } = useContext(WidgetContextData)
    const { setAutomationRateData, setErrorRateData, setErrorRateMonthData, setGraphType, setMonth, setValidationField } = useContext(WidgetContextReducers)
    const connection = useRef<HubConnection | undefined>(undefined)
    const monthRef = useRef<string>(month)
    const graphTypeRef = useRef<GraphType>(graphType)

    // Use copies of state as refs to prevent stale closures in signalR event handlers
    useEffect(() => {
        monthRef.current = month
    }, [month])

    useEffect(() => {
        graphTypeRef.current = graphType
    }, [graphType])

    useEffect(() => {
        if (!hubCoId) return

        const connect = async (hubCoId: string, widgetId: string) => {
            try {
                connection.current = new HubConnectionBuilder().withUrl(navigatorApiUrl, axiosOptions).configureLogging(LogLevel.Information).build()

                connection.current.on('percentAutomatedUpdate', onOrderAutomationDataUpdate)
                connection.current.on('percentErrorRateUpdate', onErrorRateDataUpdate)
                connection.current.on('errorByMonthUpdate', onErrorRateByMonthDataUpdate)

                await connection.current.start()
                await connection.current.invoke('SubscribeToWidget', { hubCoId, widgetId })
            } catch (error) {
                console.log('signalR Error: ', error)
            }
        }

        connect(hubCoId, widgetId)
        fetchAutomationRateData(hubCoId)
        return () => {
            connection.current?.stop()
        }
    }, [hubCoId]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchAutomationRateData = async (hubCoId: string) => {
        try {
            const res: AxiosResponse<OrderAutomationResponse> = await axios.get(`${navigatorApiUrl}/order-automation?hubCoId=${hubCoId}`, axiosOptions)
            const mapData = res.data.data.map((d) => ({ Label: d.spokeCoName, Value: Math.round(d.value * 100) })).sort((a, b) => a.Value - b.Value)
            setAutomationRateData(mapData)
        } catch {
            setAutomationRateData([])
        }
    }

    useEffect(() => {
        switch (graphType) {
            case GraphType.ErrorRate:
                fetchErrorRateData(hubCoId)
                break
            case GraphType.ErrorRateByMonth:
                fetchErrorRateByMonthData(hubCoId, month)
                break
            case GraphType.ErrorRateByMonthByField:
                // add API call here when available
                break
        }
    }, [graphType]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchErrorRateData = async (hubCoId: string) => {
        try {
            const res: AxiosResponse<ErrorRateResponse> = await axios.get(`${navigatorApiUrl}/order-error?hubCoId=${hubCoId}`, axiosOptions)
            const mapData = res.data.data
                .map((d) => ({ FriendlyLabel: convertMonthLabels(d.label), Label: d.label, Value: Math.round(d.value * 100) }))
                .sort((a, b) => b.Label.localeCompare(a.Label))
            setErrorRateData(mapData)
        } catch {
            setErrorRateData([])
        }
    }

    const fetchErrorRateByMonthData = async (hubCoId: string, month: string) => {
        try {
            const res: AxiosResponse<ErrorRateResponse> = await axios.get(
                `${navigatorApiUrl}/order-error-month?hubCoId=${hubCoId}&month=${month}`,
                axiosOptions,
            )
            const mapData = res.data.data
                .map((d) => ({ FriendlyLabel: toPascalCase(d.label), Label: d.label, Value: Math.round(d.value * 100) }))
                .sort((a, b) => (a.Value === b.Value ? a.Label.localeCompare(b.Label) : b.Value - a.Value))
            setErrorRateMonthData(mapData)
        } catch {
            setErrorRateMonthData([])
        }
    }

    const handleAutomationRateChartSelection = () => {
        setGraphType(GraphType.AutomationRate)
    }

    const handleErrorRateChartSelection = () => {
        setGraphType(GraphType.ErrorRate)
    }

    const onOrderAutomationDataUpdate = (res: string) => {
        const body: RealtimeResponseData = JSON.parse(res)
        const mapData = body.data.map((d) => ({ Label: d.spokeCoName, Value: Math.round(d.value * 100) })).sort((a, b) => a.Value - b.Value)
        setAutomationRateData(mapData)
    }

    const onErrorRateDataUpdate = (res: string) => {
        const body: RealTimeErrorRateResponseData = JSON.parse(res)
        console.log(res)
        const mapData = body.data.map((d) => ({ Label: d.label, Value: Math.round(d.value * 100) })).sort((a, b) => a.Value - b.Value)
        setErrorRateData(mapData)
    }

    const onErrorRateByMonthDataUpdate = (res: string) => {
        const body: RealTimeErrorRateByMonthResponseData = JSON.parse(res)

        // If event doesn't apply to currently displayed graph, ignore it
        if (graphTypeRef.current !== GraphType.ErrorRateByMonth || monthRef.current !== body?.month) return

        const data = body.data
            .map((d) => ({ FriendlyLabel: toPascalCase(d.label), Label: d.label, Value: Math.round(d.value * 100) }))
            .sort((a, b) => (a.Label > b.Label ? 1 : -1))
        setErrorRateMonthData(data)
    }

    const handleBarClick = (dataFromClick: BarEventObject) => {
        const month = dataFromClick.Label
        setMonth(month)
        setGraphType(GraphType.ErrorRateByMonth)
    }

    const handleBarClickOnValidations = (dataFromClick: BarEventObject) => {
        // TODO: Connect BE to FE for field data when available
        const validationField = dataFromClick.Label
        setValidationField(validationField)
        setGraphType(GraphType.ErrorRateByMonthByField)
    }

    const displayGraph = () => {
        switch (graphType) {
            case GraphType.AutomationRate:
                return automationRateData.length > 0 ? (
                    <BarGraphWidget
                        customLegend={customLegendForPercentAutomatedBarGraph}
                        data={automationRateData}
                        height={graphDimensions.height}
                        industryBenchmarkValue={orderAccuracyBenchmarkValues.industryBenchmarkValue}
                        internalAutomationGoalValue={orderAccuracyBenchmarkValues.internalAutomationGoalValue}
                        showBenchmarkLines={true}
                        showLegend={true}
                        width={graphDimensions.width}
                    />
                ) : (
                    <></>
                )
            case GraphType.ErrorRate:
                return errorRateData.length > 0 ? (
                    <BarGraphWidget
                        customLegend={customLegendForPercentAutomatedBarGraph}
                        data={errorRateData}
                        handleClick={handleBarClick}
                        height={graphDimensions.height}
                        industryBenchmarkValue={errorRateBenchmarkValues.industryBenchmarkValue}
                        internalAutomationGoalValue={errorRateBenchmarkValues.internalAutomationGoalValue}
                        showBenchmarkLines={true}
                        showLegend={true}
                        useFriendlyLabels={true}
                        width={graphDimensions.width}
                    />
                ) : (
                    <></>
                )
            case GraphType.ErrorRateByMonth:
                return errorRateMonthData.length > 0 ? (
                    <BarGraphWidget
                        colorComparison={false}
                        data={errorRateMonthData}
                        handleClick={handleBarClickOnValidations}
                        height={graphDimensions.height}
                        industryBenchmarkValue={0}
                        internalAutomationGoalValue={errorRateByMonthBenchmarkValues.internalAutomationGoalValue}
                        showLegend={false}
                        useFriendlyLabels={true}
                        width={graphDimensions.width}
                    />
                ) : (
                    <></>
                )
            case GraphType.ErrorRateByMonthByField:
                return errorRateMonthFieldData.length > 0 ? (
                    <StackedWidget
                        benchmarkValue={errorRateByMonthByFieldBenchmarkValues.benchmarkValue}
                        customLegend={customLegendForStackedBarGraph}
                        data={errorRateMonthFieldData}
                        height={graphDimensions.height}
                        showLegend={true}
                        width={graphDimensions.width}
                    />
                ) : (
                    <></>
                )
        }
    }

    return (
        <Grid container direction="column">
            <Grid item style={{ maxWidth: '100%', padding: '0px 12px 24px 12px' }}>
                <Grid container justifyContent="center">
                    <Grid item>
                        <Button
                            color={graphType === GraphType.AutomationRate ? 'primary' : 'customGrey'}
                            sx={{ height: '48px', marginRight: '24px', width: '320px' }}
                            variant="contained"
                            onClick={handleAutomationRateChartSelection}
                        >
                            <Grid container alignItems="center" justifyItems="space-between">
                                <Grid item width="92%">
                                    <Typography style={{ fontFamily: 'Rubik', fontWeight: 500 }}>{'ORDER AUTOMATION RATE'}</Typography>
                                </Grid>
                                <Grid item width="8%">
                                    <Grid container alignItems="center" justifyItems="center">
                                        <ArrowDropDownIcon />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            color={graphType !== GraphType.AutomationRate ? 'primary' : 'customGrey'}
                            sx={{ height: '48px', marginRight: '24px', width: '320px' }}
                            variant="contained"
                            onClick={handleErrorRateChartSelection}
                        >
                            <Grid container alignItems="center" justifyItems="space-between">
                                <Grid item width="92%">
                                    <Typography style={{ fontFamily: 'Rubik', fontWeight: 500 }}>{'ORDER ERROR RATE'}</Typography>
                                </Grid>
                                <Grid item width="8%">
                                    <Grid container alignItems="center" justifyItems="center">
                                        <ArrowDropDownIcon />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item style={{ maxWidth: '100%' }}>
                <Grid container justifyContent="center">
                    {displayGraph()}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default WidgetWrapper
