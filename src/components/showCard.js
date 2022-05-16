import React, { useState } from 'react'
import { Card, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core'
import parse from 'html-react-parser'
import ImgPlaceHolder from '../static/image-placeholder.png'
import { TRANSITION_DURATION_SECONDS } from '../constants'
import Badge, { StatusBadge } from './badge'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        height: '500px',
        scrollbarWidth: 'none',
        '& img': {
            height: '400px'
        },
        '&:hover': {
            transform: 'scale(1.25)',
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'row',
            width: '700px',
            transition: `transform ${ TRANSITION_DURATION_SECONDS }s`,
            '& img': {
                height: '100%',
                width: 'auto',
                transition: `height ${ TRANSITION_DURATION_SECONDS }s`
            }
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
            display: 'flex',
            '& > div': {
                display: 'flex',
                flexDirection: 'column',
                '&:last-child': {
                    flexGrow: 1,
                    alignItems: 'flex-end'
                }
            }
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

    const imageSrc = show.image
                        ? show.image.medium
                        : ImgPlaceHolder
                        
    const genres = show.genres && show.genres.length > 0
                    ? show.genres.reduce((acc, val) => acc += ', ' + val)
                    : null

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
            image={ imageSrc }
            alt={ `${ show.name } poster` } />

        <CardContent id='content'>
            <div id='showHeader'>
                <div>
                    {/* Name */}
                    <Typography variant='h2'>{ show.name }</Typography>
                    
                    {/* Genres */}
                    <Typography variant='body2' className={ classes.emphasis }>
                        { genres }
                    </Typography>

                    {/* Years on air and run time */}
                    {
                        isHovering &&
                        <Typography variant='body2'>{ yearsRun } • { runtime }</Typography>
                    }
                </div>
                <div>
                    <StatusBadge text={ show.status } />

                    {/* Network or channel */}
                    {
                        isHovering && networkOrChannelName &&
                        <Badge text={ networkOrChannelName } />
                    }
                </div>
            </div>
            {/* Summary */}
            {
                isHovering &&
                <div id='summary'>
                    { summary }
                </div>
            }
        </CardContent>
    </Card>
}

export default ShowCard