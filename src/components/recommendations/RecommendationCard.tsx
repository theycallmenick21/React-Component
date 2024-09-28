import { ConnectWithoutContact, TipsAndUpdates, Warning } from '@mui/icons-material'
import { SyntheticEvent, useContext } from 'react'

import { GraphType } from '../../enums'
import { WidgetContextData, WidgetContextReducers } from '../context/WidgetConext'
import CheckboxCard from './CheckboxCard'
import CollapsibleCard from './CollapsibleIconCard'
import IconCard from './IconCard'

type RecommendationCardProps = {
    month?: string
    recommendationText: string
    spokeCoNames?: string[]
}

const portalUrl = import.meta.env.VITE_PARTNER_PORTAL_URL
const hubCoId = import.meta.env.VITE_DEMO_HUBCO_ID
const documentId = import.meta.env.VITE_DEMO_DOCUMENT_ID
const userId = import.meta.env.VITE_DEMO_USER_ID

//const validationImprovement = "On average Conexiom customers see an increase of X% when enabling part number validations."

const GetButtonText = (graphType: GraphType) => {
    if (graphType === GraphType.AutomationRate) {
        return 'NOTIFY CSR'
    }
    if (graphType === GraphType.ErrorRateByMonthByField) {
        return 'ENABLE VALIDATION'
    }
    if (graphType === GraphType.ErrorRate) {
        return 'VIEW ISSUES'
    }
    return 'REVIEW'
}

const GetCardIcon = (graphType: GraphType) => {
    if (graphType === GraphType.AutomationRate) {
        return <ConnectWithoutContact sx={{ color: '#2196F3', height: '53.33px', width: '53.33px' }} />
    }
    if (graphType === GraphType.ErrorRate) {
        return <Warning sx={{ color: '#FF3D00', height: '50.67px', width: '58.67px' }} />
    }
    return <TipsAndUpdates sx={{ color: '#52824F', height: '58.67px', width: '60px' }} />
}

const GetCardInformation = (recommendationText: string, spokeCoNames?: string[], month?: string) => {
    const { graphType } = useContext(WidgetContextData)
    const { setGraphType, setMonth } = useContext(WidgetContextReducers)

    if (graphType === GraphType.AutomationRate) {
        return (
            <CollapsibleCard
                buttonText={GetButtonText(graphType)}
                cardIcon={GetCardIcon(graphType)}
                cardText={recommendationText}
                handleClick={(event?: SyntheticEvent) => {
                    event?.stopPropagation()
                }}
            />
        )
    }
    if (graphType === GraphType.ErrorRate) {
        return (
            <IconCard
                buttonText={GetButtonText(graphType)}
                cardIcon={GetCardIcon(graphType)}
                cardText={recommendationText}
                handleClick={(event: SyntheticEvent) => {
                    event.stopPropagation()
                    setMonth(month || '')
                    setGraphType(GraphType.ErrorRateByMonth)
                }}
            />
        )
    }
    if (graphType === GraphType.ErrorRateByMonthByField) {
        if (!spokeCoNames) {
            return <></>
        }
        return (
            <CheckboxCard
                buttonText={GetButtonText(graphType)}
                cardIcon={GetCardIcon(graphType)}
                cardText={recommendationText}
                handleClick={(event?: SyntheticEvent) => {
                    event?.stopPropagation()
                }}
                spokeCoNames={spokeCoNames}
            />
        )
    }
    return (
        <IconCard
            buttonText={GetButtonText(graphType)}
            cardIcon={GetCardIcon(graphType)}
            cardText={recommendationText}
            handleClick={(event: SyntheticEvent) => {
                event.stopPropagation()
                //assumes user is logged in to PP5 already
                window.location.href = `${portalUrl}/partner/docValidator?document=${documentId}&userid=${userId}&mode=correction&hubco=${hubCoId}`
            }}
        />
    )
}

export default function RecommendationCard({ recommendationText, spokeCoNames, month }: RecommendationCardProps) {
    return GetCardInformation(recommendationText, spokeCoNames, month)
}
