import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QueryBuilder from "./pages/QueryBuilder";

const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Main = lazy(() => import("./pages/Main"));
const LogIn = lazy(() => import("./pages/LogIn"));
const Database = lazy(() => import("./pages/Database"));
const Features = lazy(() => import("./pages/Features"));
const Docs = lazy(() => import("./pages/Docs"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
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
          <Route path="/query-builder/:id/:dbname" element={<QueryBuilder />} />
          <Route path="/features" element={<Features />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/contact" element={<Contact />} /> 
          <Route path="/about" element={<About />} />

        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
