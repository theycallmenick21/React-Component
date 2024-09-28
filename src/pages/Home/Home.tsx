import { Navigation } from '@mui/icons-material'
import { Grid, useTheme } from '@mui/material'
import { FC, useEffect } from 'react'

import Header from '../../components/header/Header'
import TabsComponent from '../../components/tabs/TabsComponent'
import { mainAppScreenId } from '../../constants'
import { resetAllStores } from '../../states/utils/zustand'

const tabData = [
    { content: <div>Content for Order Statistics</div>, label: 'Order Statistics' },
    { content: <div>Content for Order Automation</div>, label: 'Order Automation' },
    { content: <div>Content for Order with Errors</div>, label: 'Order with Errors' },
    { content: <div>Content for Order Accuracy</div>, label: 'Order Accuracy' },
    { content: <div>Content for Average Cost to Serve</div>, label: 'Average Cost to Serve' },
]

const Home: FC = () => {
    const theme = useTheme()

    useEffect(() => {
        return () => {
            if (document.getElementById(mainAppScreenId) === null) {
                resetAllStores()
            }
        }
    }, [])

    const headerIcon = (
        <Navigation aria-label="navigator icon" sx={{ color: theme.palette.turquoise.main, height: theme.spacing(6), width: theme.spacing(6) }} />
    )

    return (
        <Grid alignContent="flex-start" direction="column" id={mainAppScreenId} width="100%">
            <Grid item>
                <Header icon={headerIcon} title="Navigator" />
            </Grid>

            <Grid item style={{ height: '100vh' }}>
                <TabsComponent tabData={tabData} />
            </Grid>
        </Grid>
    )
}

export default Home
