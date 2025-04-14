import 'bootstrap/dist/css/bootstrap.css'

import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NavBar } from './components/NavBar'

const Directory = React.lazy(() => import('./views/Directory'))
const Authorizer = React.lazy(() => import('./views/Authorizer'))

function App() {
  return (
    <div id="root">
      <NavBar />
      <Suspense fallback={<></>}>
        <Routes>
          <Route element={<Directory />} path="/ui/directory/*" />
        </Routes>
        <Routes>
          <Route element={<Authorizer />} path="/ui/authorizer/*" />
        </Routes>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}

export default App
