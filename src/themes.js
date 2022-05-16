import { createTheme } from "@material-ui/core"

export const colors = {
    primary: '#E7EAE1',
    secondary: '#0E2234',
    info: '#75B7BB',
    onGoingShow: '#279107'
}

const theme = createTheme({
    palette: {
        primary: {
            main: colors.primary
        },
        secondary: {
            main: colors.secondary
        },
        info: {
            main: colors.info
        }
    },
    typography: {
        h1: {
            fontSize: '2.75rem'
        },
        h2: {
            fontSize: '1.45rem'
        },
        h3: {
            fontSize: '1.2rem'
        },
        h4: {
            fontSize: '0.9rem'
        }
    },
    shape: {
        borderRadius: 5
    }
})

export default theme