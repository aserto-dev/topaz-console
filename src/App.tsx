import 'bootstrap/dist/css/bootstrap.css'

import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NavBar } from './components/NavBar'

const DirectoryBrowser = React.lazy(() => import('./views/DirectoryBrowser'))

function App() {
  return (
    <div id="root">
      <NavBar />
      <Suspense fallback={<></>}>
        <Routes>
          <Route element={<DirectoryBrowser />} path="/ui/directory/*" />
        </Routes>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}

export default App
