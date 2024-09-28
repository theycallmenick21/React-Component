import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'

import { getContainerStyles, getPrincipalTabStyles, getTabStyles } from './Tabs.styles'

interface TabData {
    content: React.ReactNode
    label: string
}

interface TabsComponentProps {
    tabData: TabData[]
}

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div aria-labelledby={`simple-tab-${index}`} hidden={value !== index} id={`simple-tabpanel-${index}`} role="tabpanel" {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

const TabsComponent: React.FC<TabsComponentProps> = ({ tabData }) => {
    const [value, setValue] = useState(0)
    const [loadedTabs, setLoadedTabs] = useState<number[]>([])
    const theme = useTheme()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
        if (!loadedTabs.includes(newValue)) {
            setLoadedTabs([...loadedTabs, newValue])
        }
    }

    return (
        // <Box sx={getContainerStyles(theme)}>
        //     <Tabs aria-label="dynamic tabs" sx={getPrincipalTabStyles()} value={value} onChange={handleChange}>
        //         {tabData.map((tab, index) => (
        //             <Tab key={index} label={tab.label} sx={getTabStyles(theme)} />
        //         ))}
        //     </Tabs>
        //     {tabData.map((tab, index) => (
        //         <TabPanel index={index} key={index} value={value}>
        //             {loadedTabs.includes(index) && tab.content}
        //         </TabPanel>
        //     ))}
        // </Box>
        <Box sx={getContainerStyles(theme)}>
        <Tabs
            aria-label="dynamic tabs"
            value={value}
            onChange={handleChange}
            sx={getPrincipalTabStyles()}
        >
            {tabData.map((tab, index) => (
                <Tab
                    key={index}
                    label={tab.label}
                    sx={getTabStyles(theme)}
                />
            ))}
        </Tabs>
    </Box>
    )
}

export default TabsComponent
