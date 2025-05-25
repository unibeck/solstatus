import { RedwoodProvider } from 'rwsdk'
import AppRoutes from './Routes'
import './index.css' // We'll create this file next

const App = () => {
  return (
    <RedwoodProvider>
      <AppRoutes />
    </RedwoodProvider>
  )
}

export default App