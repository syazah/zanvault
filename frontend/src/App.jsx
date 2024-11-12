import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
const Home = lazy(() => import("./pages/Home"));

function App() {
  return (
    <Suspense>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/login"} element={<Home />} />
          <Route path={"/signup"} element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
