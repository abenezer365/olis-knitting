import React from 'react'
import { BrowserRouter , Route, Routes} from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard'
function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/dashboard/*' element={<Dashboard />}/>            
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default Router
