import { createTheme } from "@material-ui/core"

export const colors = {
    red: '#BA0913',
    blue: '#0E2234',
    light_blue: '#75B7BB',
    cream: '#E7EAE1',
    item_hover: '#EEEEEE',
    link: '#0D6EFD'
}

const theme = createTheme({
    palette: {
        primary: {
            main: colors.red
        },
        secondary: {
            main: colors.blue
        },
        info: {
            main: colors.light_blue
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
            fontSize: '1rem'
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