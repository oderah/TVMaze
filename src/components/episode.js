import React, { useState } from 'react'
import { Card, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core'
import parse from 'html-react-parser'
import ImgPlaceHolder from '../static/image-placeholder.png'
import { RatingBadge } from './badge'
import { isMobile } from 'react-device-detect'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: '150px',
        '& #content': {
            flexDirection: 'column'
        },
        '& #header': {
            display: 'flex'
        },
        '& #runtime': {
            flexGrow: 1
        },
        '& #url': {
            fontSize: '0.6rem',
            fontStyle: 'italic'
        },
        '& #summary': {
            width: '100%',
            overflow: 'unset',
            overflowY: 'scroll',
            textOverflow: 'unset',
            scrollbarWidth: 'none',
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
        }
    }
}))

const parseRuntime = runtime => {
    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    let parsedTime = ''
    if (hours > 0) parsedTime += `${ hours } hr`
    if (minutes > 0) parsedTime += ` ${ minutes } min`
    return parsedTime
}

export const Episode = props => {
    const { episode } = props

    const [ isHovering, setIsHovering ] = useState(false)
    const [ mobileClick, setMobileClick ] = useState(false) 

    const classes = useStyles()

    const title = `S${ episode.season }E${ episode.number } ${ episode.name }`

    let avgRating = episode.rating.average
    if (avgRating && !avgRating.toString().includes('.')) avgRating += '.0'

    const summary = parse(episode.summary)

    const runtime = parseRuntime(episode.runtime)

    const imageSrc = episode.image
                        ? episode.image.medium
                        : ImgPlaceHolder


    const url = episode.url
                    ? episode.url
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


    return !episode
            ? <div />
            : <Card className={ classes.root }
                    onClick={ onTap }
                    onMouseEnter={ onMouseEnter }
                    onMouseLeave={ onMouseLeave }>

        <CardMedia
            component='img'
            image={ imageSrc }
            alt={ `${ episode.name } poster` } />

        <CardContent id='content'>
            <div id='header'>
                {/* Title */}
                <Typography variant='h4'>
                    { title }
                </Typography>

                &nbsp;•&nbsp; 

                {/* Run time */}
                <Typography id='runtime' variant='body2'>
                    { runtime }
                </Typography>

                {/* Average rating */}
                <RatingBadge text={ avgRating } />
            </div>


            {/* URL */}
            {
                url &&
                <a href={ url }>
                    <Typography
                            variant='body2'
                            id='url'>
                        { url }
                    </Typography>
                </a>
            }

            {/* Summary */}
            <div id='summary'>
                { summary }
            </div>
        </CardContent>
    </Card>
}

export default Episode