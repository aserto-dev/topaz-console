import './index.css'

import { Suspense } from 'react'

import Frame from './Frame'
import { Navigate, Route, Routes } from 'react-router'
import AuthorizerApiDocs from './pages/ApiDocs'
import Evaluator from './pages/Evaluator'
import Modules from './pages/Modules'

const PolicyInstanceDetails = () => {
  return (
    <Suspense fallback={<Frame />}>
      <Routes>
        <Route element={<Evaluator />} path="/evaluator" />
        <Route element={<Modules />} path="/modules" />
        <Route
          element={
            <Frame>
              <AuthorizerApiDocs />
            </Frame>
          }
          path="/docs"
        />
        <Route element={<Navigate to="modules" />} path="*" />
      </Routes>
    </Suspense>
  )
}

export default PolicyInstanceDetails
