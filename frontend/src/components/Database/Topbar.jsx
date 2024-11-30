import React from "react";

function Topbar({
  selectedTables,
  setSelectedTables,
  setDataTableSelected,
  dataTableSelected,
}) {
  return (
    <div className="w-full bg-zinc-900 h-[30px] border-b-[1px] border-secondary flex justify-start items-center">
      {selectedTables.map((table, index) => {
        return (
          <div
            onClick={() => setDataTableSelected(index)}
            key={index}
            className={`w-[100px] cursor-pointer p-2 h-full text-white flex justify-between items-center gap-1 text-xs border-r-[1px] capitalize border-secondary ${
              dataTableSelected === index ? "bg-secondary" : "bg-zinc-900"
            }`}
          >
            {table}
            <div
              onClick={() => {
                const newTables = selectedTables.filter((tab) => tab != table);
                setSelectedTables(newTables);
                setDataTableSelected(0);
              }}
              className={`text-sm  cursor-pointer`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 hover:stroke-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Topbar;
