import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import DirectoryApiDocs from './pages/ApiDocs'
import DangerZone from './pages/DangerZone'
import Frame from './pages/Directory'
import Directory from './pages/Directory'
import DirectoryEvaluator from './pages/Evaluator'
import Model from './pages/Model'
import ObjectInstance from './pages/ObjectInstance'
import Objects from './pages/Objects'
import Relations from './pages/Relations'

const DirectoryBrowser = () => {
  return (
    <Suspense fallback={<Frame />}>
      <Routes>
        <Route element={<Directory />} path="objects">
          <Route element={<Objects />} path=":objectType" />
          <Route element={<ObjectInstance />} path=":objectType/:objectId/*" />
          <Route element={<Navigate replace to="user" />} index />
        </Route>
        <Route element={<Directory />} path="model">
          <Route element={<Model />} path="" />
        </Route>
        <Route element={<Directory />} path="relations">
          <Route element={<Relations />} path="" />
        </Route>
        <Route element={<Directory />} path="evaluator">
          <Route element={<DirectoryEvaluator />} path="" />
        </Route>

        <Route element={<Directory />} path="docs">
          <Route element={<DirectoryApiDocs />} path="" />
        </Route>
        <Route element={<Directory />} path="danger">
          <Route element={<DangerZone />} path="" />
        </Route>
        <Route element={<Navigate replace to="model" />} index />
      </Routes>
    </Suspense>
  )
}

export default DirectoryBrowser
