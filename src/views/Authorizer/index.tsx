import './index.css'

import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import Frame from './Authorizer'
import Authorizer from './Authorizer'
import AuthorizerApiDocs from './pages/ApiDocs'
import Evaluator from './pages/Evaluator'
import Modules from './pages/Modules'

const PolicyInstanceDetails = () => {
  return (
    <Suspense fallback={<Frame />}>
      <Routes>
        <Route element={<Authorizer />} path="evaluator">
          <Route element={<Evaluator />} path="" />
        </Route>
        <Route element={<Authorizer />} path="modules">
          <Route element={<Modules />} path="" />
        </Route>
        <Route element={<Authorizer />} path="docs">
          <Route element={<AuthorizerApiDocs />} path="" />
        </Route>
        <Route element={<Navigate replace to="modules" />} index />
      </Routes>
    </Suspense>
  )
}

export default PolicyInstanceDetails
