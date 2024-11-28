import React, { useEffect } from "react";

function Sidebar({ db_name }) {
  async function HandleCreateTables() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/database/create-table", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = await res.json();
      if (data.success === true) {
        sessionStorage.setItem("token", data.id);
        setLoading(false);
      } else {
        return alert(data);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      return alert("Something Went Wrong");
    }
  }

  return (
    <div className="w-[15%] bg-zinc-900 h-full border-r-[1px] border-secondary p-4 flex flex-col justify-start items-center">
      <h1 className="font-semibold text-xl text-white">Your Tables</h1>
      <div className="w-full p-2 flex justify-center items-center">
        <button className="p-2 bg-secondary w-full rounded-full hover:bg-green-800 transition-all duration-300 border-[1px] border-white">
          Add Table
        </button>
      </div>
    </div>
  );
}

function AddTablePopup() {
  return <div></div>;
}

export default Sidebar;
