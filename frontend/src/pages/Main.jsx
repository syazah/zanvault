function Main() {
  return (
    <div className="w-full h-[100vh] bg-zinc-800 flex">
      <div className="w-[10%] h-full bg-zinc-900 border-r-[1px] border-secondary"></div>
      <div className="w-[90%] h-full bg-zinc-800 flex flex-col">
        <div className="w-full flex justify-start items-center p-2 border-b-[1px] border-secondary bg-zinc-900 gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-7 stroke-secondary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>

          <h1 className="text-white font-normal text-xl">Your Databases</h1>
        </div>
        <div className="flex justify-start items-start p-4">
          <div className="w-[200px] h-[100px] border-[2px] border-secondary rounded-xl flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-10 stroke-secondary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
