import './index.css'

import { Suspense } from 'react'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router'

import { PolicyEvaluatorContextProvider } from '../../services/PolicyEvaluatorContextProvider'

const Frame = React.lazy(() => import('./Authorizer'))
const Authorizer = React.lazy(() => import('./Authorizer'))
const AuthorizerApiDocs = React.lazy(() => import('./pages/ApiDocs'))
const Evaluator = React.lazy(() => import('./pages/Evaluator'))
const Modules = React.lazy(() => import('./pages/Modules'))

const PolicyInstanceDetails = () => {
  return (
    <Suspense fallback={<Frame />}>
      <PolicyEvaluatorContextProvider>
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
      </PolicyEvaluatorContextProvider>
    </Suspense>
  )
}

export default PolicyInstanceDetails
