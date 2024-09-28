import { easeCubicInOut } from 'd3-ease'
import { interpolate } from 'd3-interpolate'
import { get } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, Cell, LabelList, Legend, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type BarGraphWidgetProps = {
    colorComparison?: boolean
    customLegend?: () => JSX.Element
    data: SpokeCoWidgetData[]
    handleClick?: (event: BarEventObject) => void
    height: number
    industryBenchmarkValue?: number
    internalAutomationGoalValue: number
    showBenchmarkLines?: boolean
    showLegend: boolean
    useFriendlyLabels?: boolean
    width: number
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

// Function to get color based on value and comparison
const getColor = (value: number, colorComparison: boolean, internalAutomationGoalValue: number) => {
    if (!colorComparison) {
        return value > internalAutomationGoalValue ? '#FF3D00' : '#0D47A1'
    }
    return value < internalAutomationGoalValue ? '#FF3D00' : '#0D47A1'
}

// YAxisTick component
const YAxisTick: React.FC<
    YAxisTickProps & { animationData: SpokeCoWidgetData[]; colorComparison: boolean; internalAutomationGoalValue: number; useFriendlyLabels: boolean }
> = ({ x, y, payload, animationData, useFriendlyLabels, colorComparison, internalAutomationGoalValue }) => {
    const label = payload.value
    const entry = animationData.find((d) => {
        return (useFriendlyLabels ? d.FriendlyLabel : d.Label) === label
    })
    const color = getColor(get(entry, 'Value', 0), colorComparison, internalAutomationGoalValue)
    return (
        <text dy="0.3em" fill={color} fontFamily="Poppins" fontSize={12} fontWeight="bold" textAnchor="end" x={x} y={y}>
            <title>{label}</title> {/* Tooltip for the full label */}
            {label}
        </text>
    )
}

// XAxisTick component
const XAxisTick: React.FC<XAxisTickProps> = ({ payload, x, y }) => (
    <text dy="0.71em" fill="black" fontFamily="Inter" fontSize={10} textAnchor="middle" x={x} y={y}>
        {payload.value}
    </text>
)

const BarGraphWidget: React.FC<BarGraphWidgetProps> = ({
    data,
    width,
    height,
    customLegend,
    showLegend = true,
    industryBenchmarkValue,
    internalAutomationGoalValue,
    showBenchmarkLines,
    colorComparison = true,
    useFriendlyLabels = false,
    handleClick,
}) => {
    const [animationData, setAnimationData] = useState<SpokeCoWidgetData[]>([])

    const requestAnimationFrameNumber = useRef<number>()

    useEffect(() => {
        const initialData = data.map((item) => ({ ...item, Value: 0 }))
        setAnimationData(initialData)

        const duration = 1000 // Duration of the animation in milliseconds
        const startTime = performance.now()

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime
            const progress = Math.min(elapsedTime / (duration * 2), 1)
            const newData = initialData.map((item, index) => {
                const delay = index * 50 // Delay between each bar animation
                const effectiveProgress = Math.max(0, Math.min((elapsedTime - delay) / duration, 1))
                return {
                    ...item,
                    Value: interpolate(item.Value, data[index].Value)(easeCubicInOut(effectiveProgress)),
                }
            })

            setAnimationData(newData)

            if (progress < 1) {
                requestAnimationFrameNumber.current = requestAnimationFrame(animate)
            }
        }

        requestAnimationFrameNumber.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(requestAnimationFrameNumber.current!)
    }, [data])

    return (
        <ResponsiveContainer height={height} width="100%">
            <BarChart data={animationData} layout="vertical" margin={{ bottom: 0, left: width - 925, right: width - 925, top: 20 }}>
                <XAxis
                    axisLine={false}
                    domain={[0, 100]}
                    tick={
                        <XAxisTick
                            payload={{
                                value: '',
                            }}
                            x={0}
                            y={0}
                        />
                    }
                    tickCount={6}
                    tickLine={false}
                    type="number"
                />
                <YAxis
                    axisLine={false}
                    dataKey={useFriendlyLabels ? 'FriendlyLabel' : 'Label'}
                    interval={0}
                    tick={
                        <YAxisTick
                            animationData={animationData}
                            colorComparison={colorComparison}
                            internalAutomationGoalValue={internalAutomationGoalValue}
                            payload={{
                                value: '',
                            }}
                            useFriendlyLabels={useFriendlyLabels}
                            x={0}
                            y={0}
                        />
                    }
                    tickFormatter={(t) => `A${t + 1}`}
                    tickLine={false}
                    type="category"
                    width={150}
                />
                <Bar dataKey="Value" isAnimationActive={false} onClick={handleClick}>
                    {animationData.map((entry, index) => (
                        <Cell fill={getColor(entry.Value, colorComparison, internalAutomationGoalValue)} key={`cell-${index}`} />
                    ))}
                    <LabelList
                        dataKey="Value"
                        fill="black"
                        fontFamily="Inter"
                        fontSize={10}
                        formatter={(value: number) => `${value.toFixed(0)}%`}
                        position="right"
                    />
                </Bar>
                {showLegend && <Legend align="center" content={customLegend} verticalAlign="bottom" />}
                {showBenchmarkLines && (
                    <>
                        <ReferenceLine
                            isFront={true}
                            label={{
                                dx: 15,
                                fill: '#FF3D00',
                                fontFamily: 'Inter',
                                fontSize: 10,
                                position: 'top',
                                value: `${internalAutomationGoalValue}%`,
                            }}
                            stroke="#FF3D00"
                            strokeDasharray="3 4"
                            x={internalAutomationGoalValue}
                        />
                        {industryBenchmarkValue && (
                            <ReferenceLine
                                isFront={true}
                                label={{
                                    dx: 15,
                                    fill: 'black',
                                    fontFamily: 'Inter',
                                    fontSize: 10,
                                    position: 'top',
                                    value: `${industryBenchmarkValue}%`,
                                }}
                                stroke="black"
                                strokeDasharray="3 4"
                                x={industryBenchmarkValue}
                            />
                        )}
                    </>
                )}
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarGraphWidget
