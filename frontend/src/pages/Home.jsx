import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import Header from "../components/Header";
function Home() {
  return (
    <div className="w-full bg-secondary min-h-screen relative">
      <Topbar />
      <Navbar />
      <Header />
    </div>
  );
}

export default Home;
