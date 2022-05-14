import React, { useEffect, useState } from 'react'
import ShowCard from '../showCard'
import request from '../../services/apiService'
import { Container } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

const CHUNK_SIZE = 20

const _ = require('lodash')

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > div': {
            margin: theme.spacing(1)
        }
    }
})

const initialState = {
    shows: [],
    cachedShows: [],
    page: 0
}

class HomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ...initialState
        }
    }

    async componentDidMount() {
        await this.getShows()
    }

    mapShows = shows => shows.map(
        show => <ShowCard key={ show.id } show={ show } />
    )

    loadMoreShows = async (e) => {
        e.preventDefault()
        await this.getShows()
    } 

    getShows = async () => {
        const { shows, cachedShows, page } = this.state

        if (cachedShows.length > 0) {
            this.setState({
                shows: shows.concat(cachedShows.pop())
            })
            return
        }

        const res = await request({
            type: 'get',
            url: `https://api.tvmaze.com/shows?page=${ page }`
        })

        if (!res) return

        let dataToCache = _.chunk(res.data, CHUNK_SIZE)
        dataToCache.reverse()
        this.setState({ 
            shows: shows.concat(dataToCache.pop()),
            cachedShows: dataToCache,
            page: page + 1
        })
    }  

    render () {
        const { shows } = this.state
        const { classes } = this.props
        return <Container className={ classes.root }>
            { 
                shows.length > 0 && this.mapShows(shows)
            }
            <button onClick={ this.loadMoreShows }>Load More</button>
        </Container>
    }
}

export default withStyles(styles)(HomePage)