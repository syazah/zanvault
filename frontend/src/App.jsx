import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Main = lazy(() => import("./pages/Main"));

function App() {
  return (
    <Suspense>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/login"} element={<Home />} />
          <Route path={"/signup"} element={<SignUp />} />
          <Route path={"/main/:id"} element={<Main />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
