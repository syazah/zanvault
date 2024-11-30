import React, { useEffect, useState } from "react";

function Datas({
  selectedTables,
  dataTableSelected,
  HandleGetSchema,
  schemaData,
  setSchemaData,
  setAddSchema,
}) {
  const [addNewData, setAddNewData] = useState(false);
  const [newData, setNewData] = useState(null);
  useEffect(() => {
    if (selectedTables[dataTableSelected]) {
      HandleGetSchema(selectedTables[dataTableSelected]);
    }
  }, [selectedTables, dataTableSelected]);
  const [parsedSchema, setParsedSchema] = useState(null);
  useEffect(() => {
    if (schemaData && schemaData.schema) {
      const schema = JSON.parse(schemaData.schema);
      setParsedSchema(schema); // Save parsed schema for validation
      const initialData = Object.keys(schema).reduce((acc, key) => {
        acc[key] = null;
        return acc;
      }, {});
      setNewData(initialData);
    }
  }, [schemaData]);
  useEffect(() => {
    if (schemaData && schemaData.schema) {
      const schemaKeys = Object.keys(JSON.parse(schemaData.schema));
      const initialData = schemaKeys.reduce((acc, key) => {
        acc[key] = null;
        return acc;
      }, {});
      setNewData(initialData);
    }
  }, [schemaData]);

  const handleInputChange = (key, value) => {
    setNewData((prev) => ({ ...prev, [key]: value }));
  };
  console.log(parsedSchema);
  return (
    <div className="w-full h-full relative">
      {schemaData === null ? (
        <div className="flex justify-center items-center text-white">
          Loading...
        </div>
      ) : schemaData.exists === false ? (
        <div
          onClick={() => setAddSchema(selectedTables[dataTableSelected])}
          className="bottom-2 right-2 absolute bg-secondary px-4 py-1 rounded-full flex justify-start items-center gap-1 hover:bg-green-900 cursor-pointer"
        >
          <h1>Add Schema</h1>
        </div>
      ) : (
        <div className="w-full h-full relative flex flex-col">
          <div
            onClick={() => {
              setAddNewData(true);
            }}
            className="bottom-2 right-2 absolute bg-secondary px-4 py-1 rounded-full flex justify-start items-center gap-1 cursor-pointer"
          >
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

          {addNewData && newData && (
            <div className="w-full flex flex-col justify-start items-start bg-zinc-800 border-b-[1px] border-black p-2 gap-1">
              {Object.entries(newData).map(([key, val], index) => (
                <div
                  key={index}
                  className="w-full flex justify-start items-start gap-4"
                >
                  <div className="flex justify-start items-center gap-1">
                    <h1 className="text-white text-sm">{index + 1}</h1>
                    <h1 className="text-white text-sm">{key}:</h1>
                  </div>
                  <input
                    placeholder="Enter Data"
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    value={val || ""}
                    type={
                      parsedSchema[key] === "int"
                        ? "number"
                        : parsedSchema[key] === "bool"
                        ? undefined
                        : "text"
                    }
                    className={
                      parsedSchema[key] !== "bool"
                        ? "bg-zinc-800 rounded-full px-1 outline-none text-white"
                        : "hidden"
                    }
                  />
                  {parsedSchema[key] === "bool" && (
                    <select
                      onChange={(e) =>
                        handleInputChange(key, e.target.value === "true")
                      }
                      value={val || ""}
                      className="bg-zinc-800 rounded-full px-1 outline-none text-white"
                    >
                      <option value="" disabled>
                        Select Value
                      </option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Datas;
