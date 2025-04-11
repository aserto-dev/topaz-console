import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Frame from '../../components/DirectoryBrowser/views/Directory'
import Directory from '../../components/DirectoryBrowser/views/Directory'
import Model from '../../components/DirectoryBrowser/views/Model'
import Relations from '../../components/DirectoryBrowser/views/Relations'
import Objects from '../../components/DirectoryBrowser/views/Objects'
import ObjectInstance from '../../components/DirectoryBrowser/views/ObjectInstance'
import DirectoryEvaluator from '../../components/DirectoryBrowser/views/Evaluator'
import DirectoryApiDocs from '../../components/DirectoryBrowser/views/ApiDocs'

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

        <Route element={<Directory />} path="apidocs">
          <Route element={<DirectoryApiDocs />} path="" />
        </Route>
        <Route element={<Navigate replace to="model" />} index />
      </Routes>
    </Suspense>
  )
}

export default DirectoryBrowser
