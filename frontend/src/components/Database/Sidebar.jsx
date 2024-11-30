import React, { useState } from "react";

function Sidebar({ tables, setAddTable, setSelectedTables, selectedTables }) {
  return (
    <div className="w-[15%] bg-zinc-900 h-full border-r-[1px] border-secondary p-2 flex flex-col justify-between items-start">
      <h1 className="font-semibold text-xl text-white border-b-[1px] border-secondary">
        Tables
      </h1>
      <div className=" flex flex-col w-full gap-1">
        {tables.map((table, index) => {
          return (
            <div key={index} className="w-full flex flex-col p-1">
              <div
                onClick={async () => {
                  if (!selectedTables.includes(table)) {
                    const newSelectedTables = [...selectedTables, table];
                    setSelectedTables(newSelectedTables);
                  }
                }}
                key={index}
                className={`w-full text-white capitalize flex justify-start items-center gap-1 cursor-pointer  text-sm group p-2`}
              >
                {/* /NAME  */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`size-4`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                  />
                </svg>

                {table}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full p-2 flex justify-center items-center">
        <button
          onClick={() => setAddTable(true)}
          className="p-2 bg-secondary w-full rounded-full hover:bg-green-800 transition-all duration-300 border-[1px] border-white"
        >
          Add Table
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
