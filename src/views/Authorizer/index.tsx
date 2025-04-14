import './index.css'

import React, { Suspense } from 'react'

import Frame from './Frame'
import { Navigate, Route, Routes } from 'react-router'
import AuthorizerApiDocs from './pages/ApiDocs'

const Evaluator = React.lazy(() => import('./pages/Evaluator'))
const Modules = React.lazy(() => import('./pages/Modules'))

const PolicyInstanceDetails = () => {
  return (
    <Suspense fallback={<Frame></Frame>}>
      <Routes>
        <Route element={<Evaluator />} path="/evaluator" />
        <Route element={<Modules />} path="/modules" />
        <Route
          element={
            <>
              <Frame>
                <AuthorizerApiDocs />
              </Frame>
            </>
          }
          path="/docs"
        />
        <Route element={<Navigate to="modules" />} path="*" />
      </Routes>
    </Suspense>
  )
}

export default PolicyInstanceDetails
