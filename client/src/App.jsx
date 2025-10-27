import React from 'react'
import Router from './Router'
import { ContextProvider } from './contexts/Context'
import { InitialState, Reducer } from './utils/reducer';
function App() {
  return (
    <>
    <ContextProvider initialState={InitialState} reducer={Reducer}>
        <Router />
    </ContextProvider>
    </>
  )
}

export default App
