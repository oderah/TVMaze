import React from 'react'
import { Badge as MuiBadge, makeStyles, Typography } from '@material-ui/core'
import theme, { colors } from '../themes'

const RUNNING = 'Running'

const useStyles = makeStyles(theme => ({
    statusBadge: {
        color: theme.palette.common.white
    },
    badge: {
        width: 'fit-content',
        fontWeight: theme.typography.fontWeightBold,
        borderRadius: theme.shape.borderRadius,
        padding: `0 ${ theme.spacing(1) }px`,
        marginBottom: theme.spacing(1)
    },
    defaultBadge: {
        backgroundColor: theme.palette.info.main
    }
}))

export const StatusBadge = props => {
    const { text } = props
    const classes = useStyles({ text })

    const bgColor = RUNNING === props.text
                ? colors.onGoingShow
                : theme.palette.secondary.main

    return <Typography variant='body2'
                        className={ `${ classes.badge } ${ classes.statusBadge }` }
                        style={ { backgroundColor: bgColor } }>
        { text }
    </Typography>
}

const Badge = props => {
    const { text } = props
    const classes = useStyles()
    return (
        <Typography variant='body2'
                className={ `${ classes.badge } ${ classes.defaultBadge }` }>
        { text }
        </Typography>
    )
}

export default Badge