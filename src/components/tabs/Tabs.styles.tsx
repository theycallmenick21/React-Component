// import { Theme } from '@mui/material'

// export const getTabStyles = ({ palette, spacing }: Theme) => ({
//     alignItems: 'center',
//     backgroundColor: '#507792',
//     color: '#FFFFFF',
//     content: '"orders with errors"',
//     display: 'flex',
//     flex: '1 0 0',
//     flexDirection: 'row',
//     fontFamily: 'Roboto',
//     height: '42px',
//     justifyContent: 'center',
//     padding: `${spacing(2)} ${spacing(4)}`,
// })

// export const getContainerStyles = ({ palette, spacing }: Theme) => ({
//     alignItems: 'center',
//     backgroundColor: palette.common.white,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: spacing(1) ?? '8px',
//     justifyContent: 'center',
// })

// export const getPrincipalTabStyles = () => ({
//     width: '100%',
//     flex: '1',
//     boxSizing: 'border-box'
// })
import { Theme } from '@mui/material';

export const getTabStyles = ({ palette, spacing }: Theme) => ({
    alignItems: 'center',
    backgroundColor: '#507792',
    color: '#FFFFFF',
    display: 'flex',
    flex: '1 0 0',
    flexDirection: 'row',
    fontFamily: 'Roboto',
    height: '42px',
    justifyContent: 'center',
    padding: `${spacing(2)} ${spacing(4)}`,
    minWidth: 0,  // Prevents the tabs from shrinking too much
});

export const getContainerStyles = ({ palette, spacing }: Theme) => ({
    alignItems: 'center',
    backgroundColor: palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(1) ?? '8px',
    justifyContent: 'center',
});

export const getPrincipalTabStyles = () => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',  // Evenly distribute the tabs across the width
    padding: 0,  // Remove padding
    margin: 0,   // Remove margin
    boxSizing: 'border-box',
});
