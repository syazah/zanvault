function Header() {
  return (
    <div className="flex flex-col justify-center items-center h-[85vh] gap-2 relative bg-secondary">
      <div className="w-full h-full flex flex-col justify-center items-center absolute top-0 left-0 gap-2 bg-zinc-900 rounded-br-[400px]">
        <h1 className="font-semibold text-6xl text-white">
          Create your <span className="text-secondary"> Database</span> in
          minutes
        </h1>
        <p className="text-zinc-200 w-1/2 text-center">
          The database that people love can be the database that you love, you
          just need to follow some simple steps
        </p>
        <button className="px-4 py-2 text-white bg-secondary rounded-full mt-2">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Header;
