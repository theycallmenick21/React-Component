import { AzureKeyCredential, ChatCompletions, OpenAIClient } from '@azure/openai'
import { Grid, Typography } from '@mui/material'
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'

import {
    errorRateBenchmarkValues,
    errorRateByMonthBenchmarkValues,
    errorRateByMonthByFieldBenchmarkValues,
    openAIOptions,
    orderAccuracyBenchmarkValues,
} from '../../constants'
import { GraphType } from '../../enums'
import { toPascalCase } from '../../utils/common'
import { WidgetContextData } from '../context/WidgetConext'
import RecommendationCard from './RecommendationCard'

type AutomationRateRecommendationData = {
    advice: string
    spokeCoName: string
}

type ErrorRateRecommendationData = {
    advice: string
    month: string
    spokeCoName: string
}

type ErrorRateByMonthRecommendationData = {
    advice: string
    validationField: string
}

type ErrorRateByMonthByFieldRecommendationData = {
    advice: string
    spokeCoNames: string[]
    validationField: string
}

type OpenAIMessage = {
    content: string
    role: string
}

type RecommendationData =
    | AutomationRateRecommendationData
    | ErrorRateRecommendationData
    | ErrorRateByMonthRecommendationData
    | ErrorRateByMonthByFieldRecommendationData

type WidgetDataWithStats = {
    data: SpokeCoWidgetData[] | StackedGraphWidgetData[]
    stats: {
        benchmarkValue?: number
        industryBenchmarkValue?: number
        internalAutomationGoalValue?: number
    }
}

//const validationRecommendation = "Conexiom AI has identified the following customers with consistent errors in their Part Number fields. We recommend turning on part number validation for the following customers:"

const errorRateMonthFieldData: StackedGraphWidgetData[] = [
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

const GetRecommendationCards = (recommendations: RecommendationData[], graphType: GraphType) => {
    const sliceEnd = graphType === GraphType.AutomationRate ? 3 : 2
    return recommendations?.slice(0, sliceEnd).map((recommendation, index) => {
        if (graphType === GraphType.ErrorRate && 'month' in recommendation) {
            return <RecommendationCard key={index} month={recommendation.month} recommendationText={recommendation.advice} />
        }
        if (graphType === GraphType.AutomationRate) {
            return <RecommendationCard key={index} recommendationText={recommendation.advice} />
        }
        if (graphType === GraphType.ErrorRateByMonth) {
            recommendation.advice = recommendation.advice.replace(/document\.[\w[\].]*/g, function (match: string) {
                return toPascalCase(match)
            })
            return <RecommendationCard key={index} recommendationText={recommendation.advice} />
        }
        if (graphType === GraphType.ErrorRateByMonthByField && 'spokeCoNames' in recommendation) {
            return <RecommendationCard key={index} recommendationText={recommendation.advice} spokeCoNames={recommendation.spokeCoNames} />
        }
    })
}

function GetGraphTypeLabel(graphType: GraphType) {
    switch (graphType) {
        case GraphType.AutomationRate:
            return 'AutomationRate'
        case GraphType.ErrorRate:
            return 'ErrorRate'
        case GraphType.ErrorRateByMonth:
            return 'ErrorRateByMonth'
        case GraphType.ErrorRateByMonthByField:
            return 'ErrorRateByMonthByField'
    }
}

function GetRecommendationData(
    data: WidgetDataWithStats,
    graphType: GraphType,
    graphLabel: string,
    setRecommendations: Dispatch<SetStateAction<RecommendationData[]>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    valdiationField?: string,
): void {
    const savedRecommendations = localStorage.getItem(graphLabel + 'Recommendations')
    if (savedRecommendations) {
        setRecommendations(JSON.parse(savedRecommendations))
        setIsLoading(false)
    } else {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY

        const client = new OpenAIClient(import.meta.env.VITE_OPENAI_BASE_URL, new AzureKeyCredential(apiKey))

        const deployment = import.meta.env.VITE_OPENAI_DEPLOYMENT

        const messages = GetSystemMessagesForAI(graphType, data, toPascalCase(valdiationField || ''))

        client
            .getChatCompletions(deployment, messages, openAIOptions)
            .then((response: ChatCompletions) => {
                setRecommendations(JSON.parse(response.choices[0]?.message?.content || ''))
                localStorage.setItem(graphLabel + 'Recommendations', JSON.stringify(JSON.parse(response.choices[0]?.message?.content || '')))
                setIsLoading(false)
            })
            .catch((err) => {
                console.error(err)
            })
    }
}

function GetSystemMessagesForAI(graphType: GraphType, data: WidgetDataWithStats, validationField?: string): OpenAIMessage[] {
    switch (graphType) {
        case GraphType.AutomationRate: {
            return [
                {
                    content:
                        "Assume you're a business analyst reviewing this information to make recommendations on correcting Trading Partner behaviour. If a Trading Partners order automation is below the customer automation goal suggest that they should have a CSR to reach out to that customer. Provide at most 3 recommendations in total and the advice for each should be between 2 to 3 sentences.",
                    role: 'system',
                },
                {
                    content: 'review this data ' + JSON.stringify(data),
                    role: 'user',
                },
                {
                    content:
                        'spokeCo refers to Trading Partner. Ensure readability by converting decimals to rounded percentages. Advise CSR outreach if data trends suggest it. Always include the name of the Trading Partner in your response.',
                    role: 'system',
                },
                {
                    content:
                        "Structure your response as an array of JSON objects, each for a specific spokeCo with recommendations. Each object should have 'spokeCoName' and 'advice'. The response should only be an array of JSON objects, no other text.",
                    role: 'system',
                },
            ]
        }
        case GraphType.ErrorRate: {
            return [
                {
                    content:
                        'Look at the data and provide a 2 to 3 sentence explanation about which month(s) you are concerned about and explain why it should be looked into and suggest clicking into the month to learn more about the errors.' +
                        ' Multiply any decimal value by 100 so it is a % AND ROUND TO THE NEAREST WHOLE NUMBER.',
                    role: 'system',
                },
                {
                    content: 'review this data ' + JSON.stringify(data),
                    role: 'user',
                },
                {
                    content:
                        'spokeCo refers to Trading Partner. Focus specifically on a month that is below either of the goals. Only provide 2 recommendations at most. When refering to a month in the advice use the FriendlyLabel term.',
                    role: 'system',
                },
                {
                    content:
                        "Structure your response as an array of JSON objects, each for a specific spokeCo with recommendations. Each object should have 'spokeCoName', 'advice' and 'month' which should match the value sent in the data and month should be in the 'yyyy-MM' format. The response should only be an array of JSON objects, no other text. The objects should be ordered by month, with the most recent being first.",
                    role: 'system',
                },
            ]
        }
        case GraphType.ErrorRateByMonth: {
            return [
                {
                    content:
                        "Assume you're a business analyst reviewing this information to make recommendations on which error types should be reviewed. Your answer should be like this: 'The {validationField} field requires manual correction more often than others. We recommend that you click into the field to see the customers most affected by this issue.'" +
                        ' Multiply any decimal value by 100 so it is a % AND ROUND TO THE NEAREST WHOLE NUMBER.',
                    role: 'system',
                },
                {
                    content: 'review this data ' + JSON.stringify(data),
                    role: 'user',
                },
                {
                    content:
                        'You should also use the name of the validationField in the recommendation and point out one that is the highest. When referring to the validation field use the FriendlyLabel term.',
                    role: 'system',
                },
                {
                    content:
                        "Structure your response as an array of JSON objects, each for a specific spokeCo with recommendations. Each object should have 'advice' and 'validationField' which is a type of error and should be equal to the Label value. The response should only be an array of JSON objects, no other text. ONLY PROVIDE 1 RECOMMENDATION.",
                    role: 'system',
                },
            ]
        }
        case GraphType.ErrorRateByMonthByField: {
            return [
                {
                    content:
                        "Always respond with these 2 sentences: 'Conexiom AI has identified the following customers with consistent errors in their " +
                        validationField +
                        ' fields. We recommend turning on ' +
                        validationField +
                        " validation for the following customers:'." +
                        "Choose 3 names to put in the array. If there are '.' in the validationField only use the word after the last '.' and capitalize the first letter.",
                    role: 'system',
                },
                {
                    content: 'review this data ' + JSON.stringify(data),
                    role: 'user',
                },
                {
                    content:
                        "Structure your response as an array (of length 1) of JSON objects. Each object should have 'spokeCoNames', which is an array of spokeCos, 'advice' and 'validationField'. The response should only be an array of JSON objects, no other text. 'valdiationField' should be equal to " +
                        validationField +
                        '.',
                    role: 'system',
                },
            ]
        }
    }
}

function Recommendations() {
    const {
        automationRateData: automationRateData,
        errorRateData: errorRateData,
        errorRateMonthData: errorRateMonthData,
        graphType,
        month,
        validationField,
    } = useContext(WidgetContextData)
    const [recommendations, setRecommendations] = useState<RecommendationData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        const graphLabel = GetGraphTypeLabel(graphType)
        let data: WidgetDataWithStats = { data: [], stats: {} }

        switch (graphType) {
            case GraphType.AutomationRate: {
                data = {
                    data: automationRateData,
                    stats: orderAccuracyBenchmarkValues,
                }
                break
            }
            case GraphType.ErrorRate: {
                data = {
                    data: errorRateData,
                    stats: errorRateBenchmarkValues,
                }
                break
            }
            case GraphType.ErrorRateByMonth: {
                data = {
                    data: errorRateMonthData,
                    stats: errorRateByMonthBenchmarkValues,
                }
                break
            }
            case GraphType.ErrorRateByMonthByField: {
                data = {
                    data: errorRateMonthFieldData,
                    stats: errorRateByMonthByFieldBenchmarkValues,
                }
                break
            }
        }
        if (data.data.length !== 0) {
            GetRecommendationData(data, graphType, graphLabel, setRecommendations, setIsLoading, validationField)
        }
    }, [graphType, automationRateData, errorRateData, errorRateMonthData, validationField])

    useEffect(() => {
        localStorage.removeItem('ErrorRateByMonthRecommendations')
        localStorage.removeItem('ErrorRateByMonthByFieldRecommendations')
    }, [month])

    useEffect(() => {
        localStorage.removeItem('ErrorRateByMonthByFieldRecommendations')
    }, [validationField])

    return (
        <Grid container alignItems="flex-start" direction="column" sx={{ backgroundColor: 'white', padding: '0px 56px 48px 56px' }}>
            <Typography color="black" fontFamily="Rubik" fontSize="34px" variant="h4">
                {'Recommendations'}
            </Typography>
            {!isLoading ? GetRecommendationCards(recommendations, graphType) : null}
        </Grid>
    )
}

export default Recommendations
