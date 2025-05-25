import { MetaTags } from '@redwoodjs/web'
import { DashboardPage as DashboardComponent } from '../../../src/app/page'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="SolStatus dashboard" />
      <DashboardComponent />
    </>
  )
}

export default HomePage