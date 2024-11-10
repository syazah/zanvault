import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
const Home = lazy(() => import("./pages/Home"));

function App() {
  return (
    <Suspense>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/authenticate"} element={<Authentication />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
