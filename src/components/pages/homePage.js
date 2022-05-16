import React from 'react'
import ShowCard from '../showCard'
import request from '../../services/apiService'
import { AppBar, CircularProgress, Container, Grid, IconButton, TextField, Toolbar, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import SearchIcon from '@mui/icons-material/Search'

const CHUNK_SIZE = 10

const _ = require('lodash')

const styles = theme => ({
    root: {
        '& #progress': {
            margin: 'calc(70vh / 2) auto'
        },
        '& header': {
            boxShadow: 'none',
            height: '100px',
            alignItems: 'center',
            '& > div:first-child': {
                width: '100%',
                margin: 'auto 0',
                display: 'flex',
                '& #title': {
                    color: theme.palette.common.white,
                    fontWeight: theme.typography.fontWeightBold,
                    [ theme.breakpoints.only('xs') ]: {
                        fontSize: theme.typography.h4.fontSize
                    },
                    [ theme.breakpoints.only('sm') ]: {
                        fontSize: theme.typography.h3.fontSize
                    },
                }
            },
            '& > div > form': {
                marginLeft: theme.spacing(2),
                flexGrow: 1,
                display: 'flex',
                '& > div': {
                    flexGrow: 1,
                    '& fieldset': {
                        borderColor: theme.palette.common.white,
                    },
                    '& div': {
                        color: theme.palette.common.white
                    }
                },
            }
        }
    }
})

const initialState = {
    shows: [],
    mappedShows: [],
    cachedShows: [],
    page: 0,
    showSearchField: false,
    isFetching: false,
    query: '',
    searchResults: []
}

class HomePage extends React.Component {
    constructor(props) {
        super(props)
        this.lastScrollPosition = 0
        this.state = {
            ...initialState
        }
    }

    async componentDidMount() {
        await this.getShows()
    }

    componentDidUpdate() {
        window.addEventListener('scroll', this.scroll, {
          passive: true
        })
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.scroll)
    }

    mapShows = shows => shows.map(
        async (aShow) => {
            const pseudoShow = aShow.show
                            ? aShow.show
                            : aShow

            const res = await request({
                type: 'get',
                url: `https://api.tvmaze.com/shows/${ pseudoShow.id }/episodes`
            })

            if (!res) return

            const show = {
                ...pseudoShow,
                episodes: res.data
            }
                            
            return <Grid item
                            key={ show.id }
                            xs={ 12 }
                            sm={ 6 }
                            md={ 4 }
                            lg={ 3 }>
                        <ShowCard show={ show } />
                    </Grid>
        }
    )

    searchShow = async (e) => {
        e.preventDefault()
        
        const { query } = this.state
        
        if (!query) return
        
        this.setState({ isFetching: true })

        const res = await request({
            type: 'get',
            url: `https://api.tvmaze.com/search/shows?q=${ query }`
        })

        if (!res) return

        return this.setState({
            searchResults: await Promise.all(this.mapShows(res.data)),
            isFetching: false
        })
    }

    getShows = async () => {  
        this.setState({ isFetching: true })
        
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
        }, async () => {
            this.setState({
                mappedShows: await Promise.all(this.mapShows(this.state.shows)),
            }, () => {
                this.setState({ isFetching: false })
            })
        })
    }

    scroll = async (e) => {
        e.preventDefault()
        
        const atTheBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
        const scrollDown = window.scrollY > this.lastScrollPosition

        if (atTheBottom && scrollDown) await this.getShows()

        this.lastScrollPosition = window.scrollY

        setTimeout(() => {
            return
        }, 1000)
    }

    updateQuery = e => {
        e.preventDefault()
        this.setState({
            query: e.target.value
        })
    }

    render () {
        const {
            mappedShows,
            isFetching,
            query,
            searchResults
        } = this.state

        const { classes } = this.props

        return <Container className={ classes.root }>
            <AppBar position='static' color='secondary'>
                <Toolbar>

                    {/* Page title */}
                    <Typography
                        variant='h1'
                        noWrap
                        component='div'
                        id='title'>
                        TVMaze
                    </Typography>

                    <form onSubmit={ this.searchShow }>
                        {/* Search field */}
                        <TextField
                            color='primary'
                            variant='outlined'
                            id='search'
                            value={ query }
                            onChange={ this.updateQuery } />

                        {/* Search button */}
                        <IconButton
                            color='primary'
                            aria-label='search show'
                            onClick={ this.searchShow }>
                            <SearchIcon />
                        </IconButton>
                    </form>
                </Toolbar>
            </AppBar>

            {/* Shows */}
            {
                isFetching &&
                <CircularProgress id='progress' />
            }
            {
                !isFetching &&
                <Grid container spacing={ 2 }>
                    {
                        query && searchResults.length > 0 &&
                        searchResults
                    }
                    { 
                        (!query || searchResults.length === 0) &&
                        mappedShows
                    }
                </Grid>
            }
        </Container>
    }
}

export default withStyles(styles)(HomePage)