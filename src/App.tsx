import 'bootstrap/dist/css/bootstrap.css'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { NavBar } from './components/NavBar'

const Directory = lazy(() => import('./views/Directory'))
const Authorizer = lazy(() => import('./views/Authorizer'))

function App() {
  return (
    <div id="root">
      <NavBar />
      <Suspense fallback={<></>}>
        <Routes>
          <Route element={<Directory />} path="/ui/directory/*" />
          <Route element={<Authorizer />} path="/ui/authorizer/*" />
          <Route element={<Navigate replace to="ui/directory/model" />} index />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}

export default App
