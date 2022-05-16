import React from 'react'
import { Card, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core'
import parse from 'html-react-parser'
import ImgPlaceHolder from '../static/image-placeholder.png'
import { RatingBadge } from './badge'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: '150px',
        marginBottom: theme.spacing(1),
        '& #episode-image': {
            width: '100%',
            height: 'auto'
        },
        '& #episode-content': {
            textAlign: 'left'
        },
        '& #header': {
            display: 'flex',
            '& h4': {
                fontWeight: theme.typography.fontWeightBold
            },
            [ theme.breakpoints.down('sm') ] :{
                '& p:last-child': {
                    alignSelf: 'baseline'
                }
            },
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
            height: '50%',
            overflow: 'unset',
            overflowY: 'scroll',
            textOverflow: 'unset',
            scrollbarWidth: 'none',
            paddingBottom: theme.spacing(1),
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
        [ theme.breakpoints.down('sm') ]: {
            flexDirection: 'column',
            height: 'unset',
            '& #episode-image': {
                width: 'auto'
            },
            '& #runtime': {
                whiteSpace: 'nowrap',
                marginRight: theme.spacing(1)
            }
        },
        [ theme.breakpoints.up('md') ]: {
            '& #episode-image': {
                height: '100%',
                width: 'auto'
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

    const classes = useStyles()

    const title = `S${ episode.season }E${ episode.number } ${ episode.name }`

    let avgRating = episode.rating.average
    if (avgRating && !avgRating.toString().includes('.')) avgRating += '.0'

    const summary = episode.summary
                    ? parse(episode.summary)
                    : ''

    const runtime = parseRuntime(episode.runtime)

    const imageSrc = episode.image
                        ? episode.image.medium
                        : ImgPlaceHolder


    const url = episode.url
                    ? episode.url
                    : null

    return !episode
            ? <div />
            : <Card className={ classes.root }>

        <CardMedia
            component='img'
            image={ imageSrc }
            id='episode-image'
            alt={ `${ episode.name } poster` } />

        <CardContent id='episode-content'>
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