import './SummaryCardComponent.css'

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
                                <div className="icon"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SummaryCardComponent
