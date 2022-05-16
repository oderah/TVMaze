import React from 'react'
import ShowCard from '../showCard'
import request from '../../services/apiService'
import { AppBar, Container, Fade, Grid, Hidden, IconButton, TextField, Toolbar, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import { TRANSITION_DURATION_MILLISECONDS } from '../../constants'

const CHUNK_SIZE = 20

const _ = require('lodash')

const styles = theme => ({
    root: {
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
                    fontWeight: theme.typography.fontWeightBold
                },
                '& > div:nth-child(2)': {
                    marginLeft: theme.spacing(2),
                    flexGrow: 1,
                    '& fieldset': {
                        borderColor: theme.palette.common.white,
                    },
                    '& div': {
                        color: theme.palette.common.white
                    }
                }
            }
        }
    }
})

const initialState = {
    shows: [],
    cachedShows: [],
    page: 0,
    showSearchField: false
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
        show => <Grid key={ show.id } item xs={ 3 }>
            <ShowCard show={ show } />
        </Grid>
    ) 

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

    toggleSearchField = e => {
        e.preventDefault()
        this.setState({
            showSearchField: !this.state.showSearchField
        })
    }

    scroll = async (e) => {
        e.preventDefault()
        const atTheBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
        const scrollDown = window.scrollY > this.lastScrollPosition
        if (atTheBottom && scrollDown) await this.getShows()
        this.lastScrollPosition = window.scrollY
    }

    render () {
        const { shows, showSearchField } = this.state
        const { classes } = this.props
        return <Container className={ classes.root }>
            <AppBar position='static' color='secondary'>
                <Toolbar>
                    {/* Menu button */}
                    <Hidden smUp>
                        <IconButton
                            size='large'
                            edge='start'
                            color='inherit'
                            aria-label='open drawer'>
                            <MenuIcon />
                        </IconButton>
                    </Hidden>

                    {/* Page title */}
                    <Typography
                        variant='h1'
                        noWrap
                        component='div'
                        id='title'>
                        TVMaze
                    </Typography>

                    {/* Search field */}
                    <Fade in={ showSearchField } timeout={ TRANSITION_DURATION_MILLISECONDS }>
                        <TextField color='primary' variant='outlined' id='search' />
                    </Fade>

                    {/* Search button */}
                    <IconButton
                        size='large'
                        color='inherit'
                        aria-label='search show'
                        onClick={ this.toggleSearchField }>
                        <SearchIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Shows */}
            <Grid container spacing={ 2 }>
                { 
                    shows.length > 0 && this.mapShows(shows)
                }
            </Grid>
        </Container>
    }
}

export default withStyles(styles)(HomePage)