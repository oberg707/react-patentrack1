import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import DashBoard from './components/DashBoard/DashBoard'
import DashBoard2 from './components/DashBoard2'
import Settings from './components/SettingsPage'

import Auth from './components/auth'

export default (
  <Switch>
    <Route path="/dashboard" component={DashBoard} />
    <Route path="/dashboard2" component={DashBoard2} />
    <Route path="/settings" component={Settings} />

    <Route path="/reset/:token" component={Auth} />
    <Route path="/" component={Auth} />
  </Switch>
)
