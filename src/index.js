import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter as Router } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core'
import { Provider } from 'react-redux'

import * as serviceWorker from './serviceWorker'
import App from './components/App'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import store from './reducers/store/configureStore'
import './index.css'
import { SnackbarProvider } from 'notistack'

const AppWrapper = () => {
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: 'dark',
        },
      }),
    [],
  )

  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </Router>
    </Provider>
  )
}

ReactDOM.render(<AppWrapper />, document.getElementById('root'))
serviceWorker.register()
//serviceWorker.unregister();
