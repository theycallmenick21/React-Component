import React, { useEffect, useState } from 'react'
import { Bar, BarChart, Cell, LabelList, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type StackedGraphWidgetData = {
    CustomerErrors: number
    FulfillmentErrors: number
    Label: string
    SellerErrors: number
}

type StackedWidgetProps = {
    benchmarkValue: number
    customLegend?: () => JSX.Element
    data: StackedGraphWidgetData[]
    height: number
    showLegend: boolean
    width?: number
}

type XAxisTickProps = {
    payload: { value: string | number }
    x: number
    y: number
}

type YAxisTickProps = {
    payload: { value: string }
    x: number
    y: number
}

type TotalPercentageLabelProps = {
    height?: string | number | undefined
    index?: number | undefined
    width?: number | string | undefined
    x?: number | string | undefined
    y?: number | string | undefined
}

const maxLabelLength = 20 // Maximum number of characters for Y-axis labels

// Function to get color based on the value and benchmark comparison
const getColor = (key: string, totalSum: number, benchmarkValue: number) => {
    if (totalSum > benchmarkValue) {
        return key === 'CustomerErrors' ? '#FF3D00' : key === 'SellerErrors' ? '#FF6E40' : '#FF9E80'
    }
    return key === 'CustomerErrors' ? '#0D47A1' : key === 'SellerErrors' ? '#1E88E5' : '#64B5F6'
}

// Function to truncate labels if they exceed max length
const truncateLabel = (label: string) => {
    return label.length > maxLabelLength ? `${label.slice(0, maxLabelLength)}...` : label
}

// XAxisTick component for custom X-axis ticks
const XAxisTick: React.FC<XAxisTickProps> = ({ payload, x, y }) => (
    <text dy="0.71em" fill="black" fontFamily="Inter" fontSize={10} textAnchor="middle" x={x} y={y}>
        {payload.value}
    </text>
)

// YAxisTick component for custom Y-axis ticks
const YAxisTick: React.FC<YAxisTickProps & { benchmarkValue: number; data: StackedGraphWidgetData[] }> = ({ payload, x, y, data, benchmarkValue }) => {
    const label = payload.value
    const entry = data.find((d) => d.Label === label)
    const totalSum = entry ? entry.CustomerErrors + entry.SellerErrors + entry.FulfillmentErrors : 0
    const color = getColor('CustomerErrors', totalSum, benchmarkValue)

    return (
        <text dy="0.35em" fill={color} fontFamily="Poppins" fontSize={12} fontWeight="bold" textAnchor="start" x={x - 150} y={y}>
            <title>{label}</title> {/* Tooltip for the full label */}
            {truncateLabel(label)}
        </text>
    )
}

// TotalPercentageLabel component for rendering percentage labels at the end of bars
const TotalPercentageLabel: React.FC<TotalPercentageLabelProps & { data: StackedGraphWidgetData[] }> = ({ x, y, width, height, index, data }) => {
    if (index === undefined || index >= data.length) return null

    const totalSum = data[index].CustomerErrors + data[index].SellerErrors + data[index].FulfillmentErrors
    return (
        <text dy="0.35em" fill="black" fontFamily="Inter" fontSize={10} textAnchor="start" x={Number(x) + Number(width) + 5} y={Number(y) + Number(height) / 2}>
            {`${totalSum.toFixed(0)}%`}
        </text>
    )
}

const StackedWidget: React.FC<StackedWidgetProps> = ({ data, height, benchmarkValue, showLegend, customLegend }) => {
    const [animationData, setAnimationData] = useState<StackedGraphWidgetData[]>([])

    useEffect(() => {
        const initialData = data.map((item) => ({ ...item, CustomerErrors: 0, FulfillmentErrors: 0, SellerErrors: 0 }))
        setAnimationData(initialData)

        const timeout = setTimeout(() => setAnimationData(data), 100)

        return () => clearTimeout(timeout)
    }, [data])

    return (
        <ResponsiveContainer height={height} width="100%">
            <BarChart data={animationData} layout="vertical" margin={{ bottom: 0, left: 60, right: 30, top: 20 }}>
                <XAxis
                    axisLine={false}
                    tick={
                        <XAxisTick
                            payload={{
                                value: '',
                            }}
                            x={0}
                            y={0}
                        />
                    }
                    type="number"
                />
                <YAxis
                    axisLine={false}
                    dataKey="Label"
                    tick={
                        <YAxisTick
                            benchmarkValue={benchmarkValue}
                            data={data}
                            payload={{
                                value: '',
                            }}
                            x={0}
                            y={0}
                        />
                    }
                    tickLine={false}
                    type="category"
                    width={maxLabelLength * 6}
                />
                <Tooltip cursor={{ fill: 'white' }} />
                {showLegend && <Legend align="center" content={customLegend} verticalAlign="bottom" />}
                {['CustomerErrors', 'SellerErrors', 'FulfillmentErrors'].map((key) => (
                    <Bar
                        animationBegin={0}
                        animationDuration={800}
                        animationEasing="ease-out"
                        dataKey={key}
                        isAnimationActive={true}
                        key={key}
                        name={key.replace('Errors', ' Errors')}
                        stackId="a"
                    >
                        {animationData.map((entry, index) => (
                            <Cell
                                fill={getColor(key, entry.CustomerErrors + entry.SellerErrors + entry.FulfillmentErrors, benchmarkValue)}
                                key={`cell-${index}`}
                            />
                        ))}
                    </Bar>
                ))}
                <LabelList content={<TotalPercentageLabel data={data} />} />
                <ReferenceLine
                    isFront={true}
                    label={{ fontFamily: 'Inter', fontSize: 10, position: 'top', value: `${benchmarkValue}%` }}
                    stroke="black"
                    strokeDasharray="3 3"
                    x={benchmarkValue}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default StackedWidget
