import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="w-full bg-zinc-950 sticky top-0 left-0 p-2 flex justify-between items-center">
      <div className="flex justify-start items-center">
        <img src="/logo.png" className="w-8 h-8" />
        <h1 className="text-white font-bold text-lg">ZANVAULT</h1>
      </div>
      <div className="flex justify-start items-center gap-4">
        <Link className="font-normal text-white">Features</Link>
        <Link className="font-normal text-white">Docs</Link>
        <Link className="font-normal text-white">About</Link>
        <Link className="font-normal text-white">Contact</Link>
      </div>
      <div className="flex justify-start items-center gap-2">
        <Link
          to={"/login"}
          className="px-4 py-1 border-[2px] border-secondary rounded-full text-white hover:bg-secondary transition-all duration-300"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-1 bg-secondary rounded-full text-white hover:bg-green-950 transition-all duration-300"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
