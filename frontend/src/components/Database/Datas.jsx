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
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [editingKey, setEditingKey] = useState(null);
  const [editBuffer, setEditBuffer] = useState(null);
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
        } else {
          acc[key] = null;
        }
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

  const primaryKeyName = parsedSchema?.primary || null;

  const toggleSelect = (primaryValue) => {
    setSelectedKeys((prev) => {
      const next = new Set(Array.from(prev));
      if (next.has(primaryValue)) next.delete(primaryValue);
      else next.add(primaryValue);
      return next;
    });
  };

  const startEdit = (record) => {
    if (!primaryKeyName) return;
    const pk = record[primaryKeyName];
    setEditingKey(pk);
    setEditBuffer(record);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditBuffer(null);
  };

  const handleEditChange = (key, value) => {
    setEditBuffer((prev) => ({ ...prev, [key]: value }));
  };

  const saveEdit = async () => {
    try {
      if (!editBuffer || !primaryKeyName) return;
      const original = JSON.parse(
        allData.find((d) => JSON.parse(d)[primaryKeyName] === editingKey)
      );
      const patch = {};
      Object.keys(editBuffer).forEach((k) => {
        if (k === "primary") return; // ignore meta
        if (JSON.stringify(editBuffer[k]) !== JSON.stringify(original[k])) {
          patch[k] = editBuffer[k];
        }
      });
      if (Object.keys(patch).length === 0) {
        cancelEdit();
        return;
      }
      const res = await fetch("/api/v1/data/update-data", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          db_name,
          table_name: selectedTables[dataTableSelected],
          primary_value: editingKey,
          data: patch,
        }),
      });
      const data = await res.json();
      if (data.success === true) {
        await HandleGetData();
        cancelEdit();
      } else {
        alert(JSON.stringify(data));
      }
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };

  const handleDelete = async (primaryValue) => {
    try {
      const res = await fetch("/api/v1/data/delete-data", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          db_name,
          table_name: selectedTables[dataTableSelected],
          primary_value: primaryValue,
        }),
      });
      const data = await res.json();
      if (data.success === true) {
        setSelectedKeys((prev) => {
          const next = new Set(Array.from(prev));
          next.delete(primaryValue);
          return next;
        });
        await HandleGetData();
      } else {
        alert(JSON.stringify(data));
      }
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };

  const handleBulkDelete = async () => {
    try {
      if (selectedKeys.size === 0) return;
      const res = await fetch("/api/v1/data/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          db_name,
          table_name: selectedTables[dataTableSelected],
          primary_values: Array.from(selectedKeys),
        }),
      });
      const data = await res.json();
      if (data.success === true) {
        setSelectedKeys(new Set());
        await HandleGetData();
      } else {
        alert(JSON.stringify(data));
      }
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };

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
          {/* Toolbar */}
          <div className="w-full flex justify-between items-center p-2">
            <div className="text-white text-sm">
              {selectedTables[dataTableSelected] && (
                <span>
                  Table: <span className="text-secondary">{selectedTables[dataTableSelected]}</span>
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {selectedKeys.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-700 text-white rounded-full hover:bg-red-800"
                >
                  Delete Selected ({selectedKeys.size})
                </button>
              )}
              <button
                onClick={() => {
                  setAddNewData(true);
                }}
                className="bg-secondary px-4 py-1 rounded-full flex justify-start items-center gap-1 cursor-pointer"
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
              </button>
            </div>
          </div>
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
              const pkVal = primaryKeyName ? parsedData[primaryKeyName] : null;
              const isEditing = editingKey !== null && pkVal === editingKey;
              const record = isEditing ? editBuffer : parsedData;
              return (
                <div
                  key={index}
                  className="w-full bg-zinc-900 p-2 border-b-[1px] border-secondary"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {primaryKeyName && (
                        <input
                          type="checkbox"
                          checked={selectedKeys.has(pkVal)}
                          onChange={() => toggleSelect(pkVal)}
                        />
                      )}
                      {primaryKeyName && (
                        <span className="text-xs text-zinc-400">{primaryKeyName}: {String(pkVal)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => startEdit(parsedData)}
                            className="px-3 py-1 bg-blue-700 text-white rounded-full hover:bg-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(pkVal)}
                            className="px-3 py-1 bg-red-700 text-white rounded-full hover:bg-red-800"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1 bg-green-700 text-white rounded-full hover:bg-green-800"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-zinc-700 text-white rounded-full hover:bg-zinc-800"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {Object.entries(record).map(([key, value], i) => {
                    if (key === "primary") return null;
                    const expected = parsedSchema?.[key];
                    const isBool = expected === "bool" || expected === "boolean";
                    const isNumber = expected === "int";
                    return (
                      <div
                        key={`${index}-${i}`}
                        className="flex justify-start items-center gap-4 mb-1"
                      >
                        <div className="flex justify-start gap-1 w-40">
                          <h1 className="text-sm text-white">{key}</h1>
                        </div>
                        {!isEditing ? (
                          <h1 className="text-sm text-secondary">{String(value)}</h1>
                        ) : (
                          <>
                            {!isBool ? (
                              <input
                                className="bg-zinc-800 rounded-full px-2 py-1 outline-none text-white"
                                type={isNumber ? "number" : "text"}
                                value={value ?? ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    key,
                                    isNumber ? Number(e.target.value) : e.target.value
                                  )
                                }
                              />
                            ) : (
                              <select
                                className="bg-zinc-800 rounded-full px-2 py-1 outline-none text-white"
                                value={(value !== null && value !== undefined ? String(value) : "")}
                                onChange={(e) => handleEditChange(key, e.target.value === "true")}
                              >
                                <option value="" disabled>
                                  Select Value
                                </option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Datas;
