import { Theme } from '@mui/material'

export const getContainerStyles = ({ palette, spacing }: Theme) => ({
    alignItems: 'center',
    backgroundColor: palette.blue.main,
    display: 'flex',
    flexWrap: 'nowrap',
    gap: spacing(3),
    justifyContent: 'space-between',
    padding: spacing(5),
    width: '100%',
})

export const getAutoCompleteStyles = ({ palette, spacing }: Theme) => ({
    backgroundColor: palette.common.white,
    border: '1px solid rgba(0, 0, 0, 0.23))',
    borderRadius: spacing(1),
    height: spacing(8),
    input: {
        '&::placeholder': {
            opacity: 1,
        },
        color: palette.common.black,
    },
    width: '100%',
})
