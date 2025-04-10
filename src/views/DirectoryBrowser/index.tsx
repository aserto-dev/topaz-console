import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import Frame from "../../components/DirectoryBrowser/views/Directory";
import Directory from "../../components/DirectoryBrowser/views/Directory";
import Model from "../../components/DirectoryBrowser/views/Model";

const DirectoryBrowser = () => {
  return (
    <Suspense fallback={<Frame />}>
      <Routes>
        <Route element={<Directory />} path="model">
          <Route element={<Model />} path="" />
        </Route>
        <Route element={<Navigate replace to="model" />} index />
      </Routes>
    </Suspense>
  );
};

export default DirectoryBrowser;
