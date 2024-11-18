import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Main = lazy(() => import("./pages/Main"));
const LogIn = lazy(() => import("./pages/LogIn"));
const Database = lazy(() => import("./pages/Database"));
function App() {
  return (
    <Suspense>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/login"} element={<LogIn />} />
          <Route path={"/signup"} element={<SignUp />} />
          <Route path={"/main/:id"} element={<Main />} />
          <Route path={"/user/:id"} element={<Database />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
