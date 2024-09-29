import './SummaryCardComponent.css'

import { TrendingDown, TrendingUp } from '@mui/icons-material'
import React from 'react'

interface SummaryCardData {
    actualPercentage: number
    higher: boolean
    label: string
    risingPercentage: number
}

interface SummaryCardComponentProps {
    summaryCardData: SummaryCardData[]
}

const SummaryCardComponent: React.FC<SummaryCardComponentProps> = ({ summaryCardData }) => {
    const TrendingUpIcon = <TrendingUp aria-label="navigator icon" sx={{ color: '#008148', height: '14px', width: '14px' }} />

    const TrendingDownIcon = <TrendingDown aria-label="navigator icon" sx={{ color: '#bf1932', height: '14px', width: '14px' }} />

    return (
        <div className="main-box">
            <div className="summary-card-box">
                {summaryCardData.map((tab) => (
                    <div className="summary-card" key={tab.label}>
                        <p className="label">{tab.label}</p>
                        <div className="percentages-box ">
                            <p className="actual-percentage">{tab.actualPercentage}%</p>
                            <div className="rising-percentage-box">
                                <p className={`rising-percentage rising-percentage ${tab.higher ? 'higher' : 'lower'}`}>
                                    {tab.risingPercentage > 0 ? `+${tab.risingPercentage}` : tab.risingPercentage} %
                                </p>
                                <div className="icon">{tab.higher ? TrendingUpIcon : TrendingDownIcon}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SummaryCardComponent
