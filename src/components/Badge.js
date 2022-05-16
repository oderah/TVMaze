import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import theme, { colors } from '../themes'
import { ENDED, RUNNING } from '../constants'

const useStyles = makeStyles(theme => ({
    statusBadge: {
        color: theme.palette.common.white
    },
    badge: {
        width: 'fit-content',
        fontWeight: theme.typography.fontWeightBold,
        borderRadius: theme.shape.borderRadius,
        padding: `0 ${ theme.spacing(1) }px`,
        marginBottom: theme.spacing(1),
        whiteSpace: 'nowrap'
    },
    defaultBadge: {
        backgroundColor: theme.palette.info.main
    }
}))

export const StatusBadge = props => {
    const { text } = props
    const classes = useStyles({ text })

    let bgColor  = null

    switch (text) {
        case RUNNING:
            bgColor = colors.onGoingShow
            break
        case ENDED:
            bgColor = theme.palette.secondary.main
            break
        default:
            bgColor = theme.palette.error.main
    }

    return <Typography variant='body2'
                        className={ `${ classes.badge } ${ classes.statusBadge }` }
                        style={ { backgroundColor: bgColor } }>
        { text }
    </Typography>
}

export const RatingBadge = props => {
    const { text } = props
    const classes = useStyles()

    const bgColor = text >= 7
                    ? theme.palette.success.main
                    : text < 7 && text >= 5
                    ? theme.palette.warning.main
                    : theme.palette.error.main

    return <Typography variant='body2'
                        className={ `${ classes.badge } ${ classes.defaultBadge } ${ classes.statusBadge }` }
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