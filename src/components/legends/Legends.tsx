export const customLegendForStackedBarGraph = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ alignItems: 'center', display: 'flex', margin: '0 10px' }}>
            <div style={{ backgroundColor: '#FF3D00', borderRadius: '50%', height: 10, marginRight: 5, width: 10 }} />
            <div style={{ backgroundColor: '#0D47FF', borderRadius: '50%', height: 10, marginRight: 5, width: 10 }} />
            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 'bold' }}>Customer Errors</span>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', margin: '0 10px' }}>
            <div style={{ backgroundColor: '#FF6E40', borderRadius: '50%', height: 10, marginRight: 5, width: 10 }} />
            <div style={{ backgroundColor: '#1E88E5', borderRadius: '50%', height: 10, marginRight: 5, width: 10 }} />
            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 'bold' }}>Seller Errors</span>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', margin: '0 10px' }}>
            <div style={{ backgroundColor: '#FF9E80', borderRadius: '50%', height: 10, marginRight: 5, width: 10 }} />
            <div style={{ backgroundColor: '#64B5F6', borderRadius: '50%', height: 10, marginRight: 5, width: 10 }} />
            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 'bold' }}>Fulfillment Errors</span>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', margin: '0 10px' }}>
            <span style={{ fontFamily: 'Inter', fontSize: 12, marginRight: 5 }}>Industry Benchmark</span>
            <div style={{ borderBottom: '1px dashed black', marginLeft: 5, width: 50 }} />
        </div>
    </div>
)

export const customLegendForPercentAutomatedBarGraph = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', marginRight: '20px' }}>
            <span style={{ fontFamily: 'Inter', fontSize: 10, marginRight: 5 }}>Industry Benchmark</span>
            <div style={{ borderBottom: '1px dashed black', width: 80 }} />
        </div>
        <div style={{ display: 'flex', marginRight: '20px' }}>
            <span style={{ color: '#FF3D00', fontFamily: 'Inter', fontSize: 10, marginRight: 5 }}>Internal Automation Goal</span>
            <div style={{ borderBottom: '1px dashed #FF3D00', width: 80 }} />
        </div>
    </div>
)
