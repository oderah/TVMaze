import React, { useState } from 'react'
import { Card, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core'
import parse from 'html-react-parser'
import ImgPlaceHolder from '../static/image-placeholder.png'
import { RUNNING, TRANSITION_DURATION_SECONDS } from '../constants'
import Badge, { RatingBadge, StatusBadge } from './badge'
import { isMobile } from 'react-device-detect'
import ReactCountryFlag from 'react-country-flag'

const OPENED_SHOW_WIDTH = '700px'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        height: '500px',
        scrollbarWidth: 'none',
        overflowX: 'hidden',
        '& img': {
            height: '400px'
        },
        '&:hover, &:active': {
            overflowY: 'scroll',
            transition: `transform ${ TRANSITION_DURATION_SECONDS }s`,
            transformOrigin: 'top right',
            '& #content': {
                width: '100%'
            },
            [ theme.breakpoints.down('sm') ]: {
                transform: 'scale(1.05)'
            },
            [ theme.breakpoints.only('md') ]: {
                transformOrigin: props => (props.id - 1) % 3 === 0
                                            ? 'top left'
                                            : 'top right',
                transform: props => (props.id -  1) % 3 === 0
                                    ? 'scale(1.25)'
                                    : 'translateX(-55%)',
            },
            [ theme.breakpoints.up('lg') ]: {
                transformOrigin: props => (props.id - 1) % 4 < 2
                                            ? 'top left'
                                            : 'top right',
                transform: props => (props.id -  1) % 4 === 0
                                    ? 'scale(1.25)'
                                    : 'translateX(-58%)',
            },
            [ theme.breakpoints.up('md') ]: {
                transform: 'scale(1.25)',
                display: 'flex',
                flexDirection: 'row',
                width: OPENED_SHOW_WIDTH,
                '& img': {
                    height: '100%',
                    width: 'auto',
                    transition: `height ${ TRANSITION_DURATION_SECONDS }s`
                }
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
    const endYear = RUNNING === status
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

const joinList = list => list.reduce((acc, val) => acc += ', ' + val)

export const ShowCard = props => {
    const { show } = props

    const [ isHovering, setIsHovering ] = useState(false)
    const [ mobileClick, setMobileClick ] = useState(false) 

    const classes = useStyles({ id: show.id })

    const yearsRun = getYearsRun(show.premiered, show.ended, show.status)
    const networkOrChannelName = show.network && show.network.name
                            ? show.network.name
                            : show.webChannel
                            ? show.webChannel.name
                            : null

    let avgRating = show.rating.average
    if (!avgRating.toString().includes('.')) avgRating += '.0'

    const summary = parse(show.summary)

    const runtime = parseRuntime(show.runtime)

    const imageSrc = show.image
                        ? show.image.medium
                        : ImgPlaceHolder
                        
    const genres = show.genres && show.genres.length > 0
                    ? joinList(show.genres)
                    : null

    const country = {
        name: show.network?.country?.name
                ? show.network.country.name
                : show.webChannel?.country?.name
                ? show.webChannel.country.name
                : null,
        code: show.network?.country?.code
                ? show.network.country.code
                : show.webChannel?.country?.code
                ? show.webChannel.country.code
                : null
    }

    const schedule = show.schedule?.time && show.schedule?.days?.length > 0
                        ? <strong>
                            { `${ joinList(show.schedule.days) }s at ${ show.schedule.time }` }
                        </strong>
                        : null

    const onMouseEnter = e => {
        e.preventDefault()
        setIsHovering(true)
    }

    const onMouseLeave = e => {
        e.preventDefault()
        setIsHovering(false)
    }

    const onMobileClick = e => {
        if (!mobileClick) onMouseEnter(e)
        else onMouseLeave(e)
        setMobileClick(!mobileClick)
    }

    const onTap = isMobile
                        ? onMobileClick
                        : null


    return !show
            ? <div />
            : <Card className={ classes.root }
                    onClick={ onTap }
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
                    <Typography variant='h2'>
                        { show.name }&nbsp;
                        <ReactCountryFlag
                            countryCode={ country.code }
                            aria-label={ country.name } />
                    </Typography>
                    
                    {/* Genres */}
                    <Typography variant='body2' className={ classes.emphasis }>
                        { genres }
                    </Typography>

                    {/* Years on air and run time */}
                    {
                        isHovering &&
                        <Typography variant='body2'>{ yearsRun } • { runtime }</Typography>
                    }

                    {/* Schedule and country */}
                    <Typography variant='body2'>
                        { schedule }
                    </Typography>
                </div>
                <div>
                    <StatusBadge text={ show.status } />

                    {/* Average rating */}
                    <RatingBadge text={ avgRating } />

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