import React from "react";

function Datas({ selectedTables, setDataTableSelected, dataTableSelected }) {
  return (
    <div className="w-full h-full relative">
      <div className="top-2 right-2 absolute bg-secondary px-4 py-1 rounded-full flex justify-start items-center gap-1">
        {selectedTables[dataTableSelected] ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <h1>Add to {selectedTables[dataTableSelected]}</h1>
          </>
        ) : (
          <h1>Select A Table From Top</h1>
        )}
      </div>
    </div>
  );
}

export default Datas;
