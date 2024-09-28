type SpokeCoWidgetData = {
    FriendlyLabel?: string
    Label: string
    Value: number
}

type StackedGraphWidgetData = {
    CustomerErrors: number
    FulfillmentErrors: number
    Label: string
    SellerErrors: number
}

type Payload = {
    Label: string
    Value: number
}

type TooltipPayload = {
    dataKey?: string
    hide?: boolean
    name?: string
    payload?: Payload
    value?: number
}

type TooltipPosition = {
    x?: number
    y?: number
}

type BarEventObject = {
    FriendlyLabel?: string
    Label: string
    Value: number
    background?: {
        height?: number
        width?: number
        x?: number
        y?: number
    }
    fill?: string
    height?: number
    payload?: Payload
    tooltipPayload?: TooltipPayload[]
    tooltipPosition?: TooltipPosition
    value?: number
    width?: number
    x?: number
    y?: number
}
