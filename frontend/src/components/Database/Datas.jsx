import React, { useEffect, useState } from "react";

function Datas({
  selectedTables,
  dataTableSelected,
  HandleGetSchema,
  schemaData,
  setAddSchema,
  id,
  db_name,
}) {
  const [addNewData, setAddNewData] = useState(false);
  const [newData, setNewData] = useState(null);
  useEffect(() => {
    if (selectedTables[dataTableSelected]) {
      HandleGetSchema(selectedTables[dataTableSelected]);
    }
  }, [selectedTables, dataTableSelected]);
  const [parsedSchema, setParsedSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState(null);
  useEffect(() => {
    if (schemaData && schemaData.schema) {
      const schema = JSON.parse(schemaData.schema);
      setParsedSchema(schema);
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
        if (key === "primary") {
          acc[key] = "";
        }
        acc[key] = null;
        return acc;
      }, {});
      setNewData(initialData);
    }
  }, [schemaData]);

  const handleInputChange = (key, value) => {
    setNewData((prev) => ({ ...prev, [key]: value }));
  };
  async function HandleAddData() {
    try {
      setLoading(true);
      if (
        Object.entries(newData).some(
          ([key, val]) => val === null && key != "primary"
        )
      ) {
        return alert("Add Some Data");
      }
      console.log(newData);
      const res = await fetch("/api/v1/data/add-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          db_name,
          table_name: selectedTables[dataTableSelected],
          data: newData,
        }),
      });
      const data = await res.json();
      if (data.success === true) {
        alert("Data Added Successfully");
        window.location.reload();
        setLoading(false);
      } else {
        setLoading(false);
        return alert(JSON.stringify(data));
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      return alert(JSON.stringify(error));
    }
  }

  async function HandleGetData() {
    try {
      const res = await fetch(
        `/api/v1/data?id=${id}&&table_name=${selectedTables[dataTableSelected]}&&db_name=${db_name}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        }
      );
      const data = await res.json();
      if (data.success === true) {
        setAllData(data.data);
      } else {
        return alert(JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
      return alert(JSON.stringify(error));
    }
  }

  useEffect(() => {
    if (selectedTables[dataTableSelected]) {
      HandleGetData();
    }
  }, [selectedTables, dataTableSelected]);

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
              {Object.entries(newData).map(([key, val], index) => {
                if (key === "primary") {
                  return;
                }
                return (
                  <div
                    key={index}
                    className="w-full flex justify-start items-start gap-4"
                  >
                    <div className="flex justify-start items-center gap-1">
                      <h1 className="text-white text-sm">{key}:</h1>
                    </div>
                    <input
                      placeholder="Enter Data"
                      onChange={(e) => {
                        if (parsedSchema[key] === "int") {
                          handleInputChange(key, Number(e.target.value));
                        } else {
                          handleInputChange(key, e.target.value);
                        }
                      }}
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
                        onChange={(e) => {
                          handleInputChange(key, e.target.value === "true");
                          console.log(newData);
                        }}
                        value={(val !== null && val.toString()) || ""}
                        className="bg-zinc-800 rounded-full px-1 outline-none text-white"
                      >
                        <option value="" disabled>
                          Select Value
                        </option>
                        <option value={"true"}>True</option>
                        <option value={"false"}>False</option>
                      </select>
                    )}
                  </div>
                );
              })}
              <div className="w-full flex justify-end items-center">
                <button
                  onClick={HandleAddData}
                  className="px-4 py-2 bg-secondary rounded-full hover:bg-green-900 transition-all duration-300"
                >
                  {loading ? "Loading..." : "Add Data"}
                </button>
              </div>
            </div>
          )}
          {allData !== null &&
            allData.map((data, index) => {
              const parsedData = JSON.parse(data);
              return (
                <div key={index} className="w-full bg-zinc-900 p-2">
                  {Object.entries(parsedData).map(
                    ([key, value], i) =>
                      key !== "primary" && (
                        <div
                          key={`${index}-${i}`}
                          className="flex justify-start items-center gap-4"
                        >
                          <div className="flex justify-start gap-1">
                            <h1 className="text-sm text-white">{key}</h1>
                          </div>
                          <h1 className="text-sm text-secondary">{value}</h1>
                        </div>
                      )
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Datas;
