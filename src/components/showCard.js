import React, { Fragment, useState } from 'react'
import { Card, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core'
import parse from 'html-react-parser'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: 'pink',
        width: 'min-content',
        maxHeight: '600px',
        width: '250px',
        scrollbarWidth: 'none',
        '&:hover': {
            transform: 'scale(1.25)',
            overflowY: 'scroll'
        },
        '& #content': {
            textAlign: 'left'
        },
        '& #summary': {
            fontSize: theme.typography.body2.fontSize,
            fontFamily: theme.typography.body2.fontFamily,
            fontWeight: theme.typography.body2.fontWeight,
            lineHeight: theme.typography.body2.lineHeight,
            letterSpacing: theme.typography.body2.letterSpacing,
        },
        '& hr': {
            opacity: 0.6
        },
        '& #showHeader': {
            display: 'flex'
        },
        '&::-webkit-scrollbar': {
            width: 0
        },
        '&::-moz-scrollbar': {
            width: 0
        },
        '&::-ms-scrollbar': {
            width: 0
        },
        '&::-o-scrollbar': {
            width: 0
        }
    },
    emphasis: {
        fontStyle: 'italic'
    }
}))

const getYearsRun = (startDate, endDate, status) => {
    const startYear = new Date(startDate).getFullYear()
    const endYear = 'Running' === status
                    ? 'present'
                    : new Date(endDate).getFullYear()
    if (startYear === endYear) return `(${ startYear })`
    return `(${ startYear }-${ endYear })`
}

const parseRuntime = runtime => {
    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    let parsedTime = ''
    if (hours > 0) parsedTime += `${ hours } hr`
    if (minutes > 0) parsedTime += ` ${ minutes } min`
    return parsedTime
}

export const ShowCard = props => {
    const { show } = props

    const [ isHovering, setIsHovering ] = useState(false)

    const classes = useStyles()

    const yearsRun = getYearsRun(show.premiered, show.ended, show.status)
    const networkOrChannelName = show.network && show.network.name
                            ? show.network.name
                            : show.webChannel
                            ? show.webChannel
                            : null

    const summary = parse(show.summary)
    const runtime = parseRuntime(show.runtime)
    const genres = show.genres && show.genres.length > 0
                    ? show.genres.reduce((acc, val) => acc += ', ' + val)
                    : null
    const isAiring = 'Running' === show.status
                    ? 'airing'
                    : 'completed'

    const onMouseEnter = e => {
        e.preventDefault()
        setIsHovering(true)
    }
    const onMouseLeave = e => {
        e.preventDefault()
        setIsHovering(false)
    }
    return <Card className={ classes.root }
                    onMouseEnter={ onMouseEnter }
                    onMouseLeave={ onMouseLeave }>

        <CardMedia
            component='img'
            image={ show.image.medium }
            alt={ `${ show.name } poster` } />
        <CardContent id='content'>

            <div id='showHeader'>
                {/* Name */}
                <Typography variant='h2'>{ show.id }</Typography>&nbsp;
                <Typography variant='body2'>{ isAiring }</Typography>
            </div>

            {/* Genres */}
            <Typography variant='body2' className={ classes.emphasis }>
                { genres }
            </Typography>

            {
                isHovering &&
                <Fragment>

                    {/* Years on air and run time */}
                    <Typography variant='body2'>{ yearsRun } • { runtime }</Typography>

                    {/* Networ or channel */}
                    {
                        networkOrChannelName &&
                        <Typography variant='body2'>{ networkOrChannelName }</Typography>
                    }

                    {/* Summary */}
                    <hr />
                    <div id='summary'>
                        { summary }
                    </div>
                </Fragment>
            }
        </CardContent>
    </Card>
}

export default ShowCard