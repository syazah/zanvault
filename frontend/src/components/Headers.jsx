import { Link } from "react-router-dom";
function Headers() {
  return (
    <div className="w-full h-[95vh] justify-start items-start flex p-4 bg-primary rounded-xl">
      <div className="w-1/2 h-full flex flex-col justify-between items-start gap-2">
        <div className="w-full p-2 flex justify-between items-center">
          <h1 className="text-white font-light text-2xl">ZanVault</h1>
          <div className="flex gap-1">
            <div className="bg-zinc-100 rounded-full w-8 h-8 justify-center items-center flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
            </div>
            <Link
              to={"/authenticate"}
              className="bg-secondary rounded-full w-8 h-8 justify-center items-center flex cursor-pointer hover:bg-zinc-100 transition-all duration-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </Link>
          </div>
        </div>
        <div className="w-full p-2 flex justify-start items-center">
          <h1 className="text-white font-normal text-5xl">
            Lightweight NoSQL Database Solution in C++ for High-Performance
            Applications
          </h1>
        </div>
      </div>
      <div className="w-1/2 rounded-xl h-full bg-secondary flex justify-center items-end">
        <img src="/dbwomen.png" />
      </div>
    </div>
  );
}

export default Headers;
