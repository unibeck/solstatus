import { Router, Route, Set } from '@redwoodjs/router'
import MainLayout from 'src/layouts/MainLayout/MainLayout'
import HomePage from 'src/pages/HomePage/HomePage'

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/endpoint-monitors/{id:String}" page={EndpointMonitorPage} name="endpointMonitor" />
      </Set>
    </Router>
  )
}

export default Routes