import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Main() {
  const [createDatabasePopup, setCreateDatabasePopup] = useState(false);
  const [currentDatbases, setCurrentDatbases] = useState(null);
  const token = sessionStorage.getItem("token");
  async function HandleFetchAllDatabases() {
    try {
      const res = await fetch("/api/v1/get-databases", {
        method: "POST",
        body: JSON.stringify({ id: token }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success === true) {
        setCurrentDatbases(data.databases);
      }
    } catch (error) {
      console.log(error);
      return alert("Something Went Wrong");
    }
  }
  useEffect(() => {
    HandleFetchAllDatabases();
  }, []);
  return (
    <div className="w-full h-[100vh] bg-zinc-800 flex relative">
      <div className="w-[15%] h-full bg-zinc-900 border-r-[1px] border-secondary flex flex-col p-2 justify-start items-center gap-4">
        <div
          style={{
            backgroundImage:
              "url('https://cdn.vectorstock.com/i/preview-1x/26/39/profile-placeholder-image-gray-silhouette-vector-22122639.jpg')",
          }}
          className="w-14 h-14 rounded-full bg-center bg-cover"
        ></div>
        <div className="border-b-[1px] border-zinc-800 text-white text-sm">
          syazah
        </div>
        <div className="border-b-[1px] border-zinc-800 text-white text-sm">
          Azaan Ahmad
        </div>
        <div className="justify-center items-center">
          <button className="px-4 py-2 bg-secondary rounded-full">
            Log Out
          </button>
        </div>
      </div>
      <div className="w-[85%] h-full bg-zinc-800 flex flex-col">
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
        {currentDatbases === null ? (
          <div>Loading...</div>
        ) : (
          <div className="flex justify-start items-start p-4 gap-2">
            {currentDatbases.map((database) => (
              <Link
                to={`/user/${token}?dbname=${database}`}
                className="w-[200px] h-[100px] border-[1px] border-secondary rounded-xl flex justify-center items-center cursor-pointer flex-col text-white hover:bg-green-900 hover:scale-90 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 stroke-yellow-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
                {database}
              </Link>
            ))}
            <div
              onClick={() => setCreateDatabasePopup(true)}
              className="w-[200px] h-[100px] border-[1px] border-white rounded-xl flex justify-center items-center cursor-pointer flex-col"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-10 stroke-zinc-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <h2 className="text-zinc-200">Create Database</h2>
            </div>
          </div>
        )}
      </div>
      {createDatabasePopup && (
        <CreateDatabasePopup setCreateDatabasePopup={setCreateDatabasePopup} />
      )}
    </div>
  );
}

function CreateDatabasePopup({ setCreateDatabasePopup }) {
  const [dbName, setDbName] = useState("");
  const [loading, setLoading] = useState(false);
  async function HandleAddDatabase() {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch("/api/v1/create-database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ db_name: dbName, id: token }),
      });
      const data = await res.json();
      if (data.success === true) {
        alert("Database, Created Successfully !!");
        setDbName("");
        setCreateDatabasePopup(false);
      } else {
        alert("Something Went Wrong");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      return alert("Something Went Wrong");
    }
  }
  return (
    <div className="absolute top-0 w-full h-full bg-[rgb(0,0,0,0.3)] flex justify-center items-center">
      <div className="w-1/2 bg-zinc-200 p-2 rounded-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl border-b-[2px] border-secondary">
            Database Name
          </h1>
          <div
            onClick={() => setCreateDatabasePopup(false)}
            className="bg-red-600 p-2 rounded-full cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 stroke-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <div className="w-full">
          <input
            onChange={(e) => setDbName(e.target.value)}
            value={dbName}
            placeholder="Enter Database Name"
            className="w-full bg-zinc-300 p-2 rounded-full"
          />
        </div>
        <div className="w-full flex justify-end items-center">
          <button
            onClick={HandleAddDatabase}
            className="bg-secondary p-2 rounded-full text-white hover:bg-green-900"
          >
            {loading ? "Loading..." : "Add Database"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Main;
