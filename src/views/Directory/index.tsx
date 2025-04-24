import { Suspense } from 'react'
import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'

const DirectoryApiDocs = lazy(() => import('./pages/ApiDocs'))
const DangerZone = lazy(() => import('./pages/DangerZone'))
const Frame = lazy(() => import('./pages/Directory'))
const Directory = lazy(() => import('./pages/Directory'))
const DirectoryEvaluator = lazy(() => import('./pages/Evaluator'))
const Model = lazy(() => import('./pages/Model'))
const ObjectInstance = lazy(() => import('./pages/ObjectInstance'))
const Objects = lazy(() => import('./pages/Objects'))
const Relations = lazy(() => import('./pages/Relations'))

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
