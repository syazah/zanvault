import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Database/Sidebar";
import Topbar from "../components/Database/Topbar";
import Datas from "../components/Database/Datas";

function Database() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dbname = queryParams.get("dbname");
  const [addTable, setAddTable] = useState(false);
  const token = sessionStorage.getItem("token");
  const [TableFormData, setTableFormData] = useState({
    db_name: dbname,
    table_name: "",
    id: token,
  });
  //ALL TABLES
  const [allTables, setAllTables] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]);
  const [schemaData, setSchemaData] = useState(null);
  const [addSchema, setAddSchema] = useState("");
  const [dataTableSelected, setDataTableSelected] = useState(0);
  async function HandleAddTable() {
    try {
      console.log(TableFormData);
      const res = await fetch("/api/v1/database/create-table", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(TableFormData),
      });
      const data = await res.json();
      if (data.success === true) {
        setTableFormData({ db_name: dbname, table_name: "", id: token });
        GetTables();
        setAddTable(false);
        return alert("Table Added Successfully");
      } else {
        return alert(JSON.stringify(data.message));
      }
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }

  async function GetTables() {
    try {
      const res = await fetch(
        `/api/v1/database/tables?id=${token}&&db_name=${dbname}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        }
      );
      const data = await res.json();
      if (data.success === true) {
        return setAllTables(data.tables);
      } else {
        return alert(data.message);
      }
    } catch (error) {
      return alert(JSON.stringify(error));
    }
  }
  async function HandleGetSchema(table_name) {
    try {
      const res = await fetch(
        `/api/v1/database/schema?id=${token}&&db_name=${dbname}&&table_name=${table_name}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (data.success === true) {
        setSchemaData(data);
      } else {
        return alert(data);
      }
    } catch (error) {
      return alert(JSON.stringify(error));
    }
  }
  useEffect(() => {
    GetTables();
  }, []);
  useEffect(() => {
    if (selectedTables.length === 1) {
      setDataTableSelected(0);
    }
  }, [selectedTables]);
  return (
    <div className="w-100% h-[100vh] bg-zinc-800 relative">
      {allTables === null ? (
        <div className="w-full h-full text-white flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <div className="w-full h-full flex">
          <Sidebar
            db_name={dbname}
            setAddTable={setAddTable}
            tables={allTables}
            selectedTables={selectedTables}
            setSelectedTables={setSelectedTables}
            HandleGetSchema={HandleGetSchema}
            schemaData={schemaData}
            setAddSchema={setAddSchema}
          />
          {addTable && (
            <AddTablePopup
              TableFormData={TableFormData}
              setAddTable={setAddTable}
              setTableFormData={setTableFormData}
              HandleAddTable={HandleAddTable}
            />
          )}
          {addSchema !== "" && (
            <AddSchemaPopup
              addSchema={addSchema}
              setAddSchema={setAddSchema}
              id={token}
              db_name={dbname}
            />
          )}
          <div className="w-[85%] h-full flex justify-start flex-col items-start">
            <Topbar
              setSelectedTables={setSelectedTables}
              selectedTables={selectedTables}
              schemaData={schemaData}
              dataTableSelected={dataTableSelected}
              setDataTableSelected={setDataTableSelected}
              setAddSchema={setAddSchema}
            />
            {selectedTables.length > 0 && (
              <Datas
                setAddSchema={setAddSchema}
                selectedTables={selectedTables}
                dataTableSelected={dataTableSelected}
                HandleGetSchema={HandleGetSchema}
                schemaData={schemaData}
                setSchemaData={setSchemaData}
                id={token}
                db_name={dbname}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AddSchemaPopup({ addSchema, setAddSchema, id, db_name }) {
  const [schema, setSchema] = useState({});
  const [loading, setLoading] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [primary, setPrimary] = useState(null);
  async function HandleFinaliseSchema() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/database/create-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          db_name,
          table_name: addSchema,
          schema: { ...schema, primary },
        }),
      });
      const data = await res.json();
      if (data.success === true) {
        setLoading(false);
        alert("Schema Added Successfully");
        window.location.reload();
      } else {
        setLoading(false);
        alert(JSON.stringify(data));
      }
    } catch (error) {
      setLoading(false);
      return alert(JSON.stringify(error));
    }
  }
  return (
    <div className="w-full h-full absolute flex justify-center items-center z-20">
      <div className="w-1/3 h-[400px] bg-zinc-900 rounded-xl p-2 flex flex-col">
        {/* HEADER  */}
        <div className="border-b-[1px] border-secondary flex justify-between items-center p-2">
          <h1 className="text-lg text-white">
            Add Schema For <span className="text-green-900">"{addSchema}"</span>
          </h1>
          <div
            onClick={() => setAddSchema("")}
            className="w-8 h-8 rounded-full bg-red-700 hover:bg-red-800 cursor-pointer flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 stroke-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        {/* MAIN BODY  */}
        <div className="w-full p-2">
          <div className="flex flex-col">
            <h1 className="text-secondary text-base">Add Key</h1>
            <input
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && keyInput.trim() !== "") {
                  setSchema({
                    ...schema,
                    [keyInput.toLowerCase().trim()]: null,
                  });
                  setKeyInput("");
                }
              }}
              onBlur={() => {
                if (keyInput.trim() !== "") {
                  setSchema({
                    ...schema,
                    [keyInput.toLowerCase().trim()]: null,
                  });
                  setKeyInput("");
                }
              }}
              className="w-full bg-zinc-950 px-1 outline-none text-white rounded-full"
            />
          </div>
        </div>
        <div className="w-full h-[300px] p-2 overflow-y-scroll">
          {/*SCHEMA*/}
          <div className="w-full flex flex-col p-2">
            {Object.entries(schema).map(([key, value], index) => {
              return (
                <div className="w-full flex justify-between items-center border-b-[1px] border-zinc-400 p-1 hover:bg-zinc-950 cursor-pointer group">
                  <div className="flex justify-start items-center">
                    <div
                      onClick={() => {
                        const updatedSchema = { ...schema };
                        delete updatedSchema[key];
                        setSchema(updatedSchema);
                      }}
                      className="hidden group-hover:flex w-4 h-4 rounded-full bg-white justify-center items-center mr-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-3 stroke-red-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </div>
                    <div
                      onClick={() => {
                        setPrimary(key);
                      }}
                      className={` ${
                        primary === key ? "flex" : "hidden group-hover:flex"
                      } w-4 h-4 rounded-full bg-yellow-600 justify-center items-center mr-2`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-3 stroke-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                        />
                      </svg>
                    </div>

                    <h1 className="text-base mr-4 text-white">{index + 1}</h1>
                    <h1 className="text-base mr-2 text-white">{key}</h1>
                  </div>
                  <select
                    value={schema[key]}
                    onChange={(e) => {
                      const newSchema = { ...schema };
                      newSchema[key] = e.target.value;
                      setSchema(newSchema);
                    }}
                    className={`text-base bg-zinc-800  p-1 rounded-full cursor-pointer focus:bg-secondary outline-none ${
                      schema[key] === null ? "text-red-600" : "text-white"
                    }`}
                  >
                    <option value={null}>null</option>
                    <option value={"int"}>int</option>
                    <option value={"string"}>string</option>
                    <option value={"bool"}>boolean</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-2 flex justify-end items-center w-full">
          <button
            onClick={HandleFinaliseSchema}
            className="px-4 bg-secondary rounded-full hover:bg-green-900"
          >
            {loading ? "Finalising..." : "Finalise Schema"}
          </button>
        </div>
      </div>
    </div>
  );
}
function AddTablePopup({
  setAddTable,
  setTableFormData,
  TableFormData,
  HandleAddTable,
}) {
  return (
    <div className="w-full h-full absolute bg-[rgb(10,10,10,0.2)] backdrop-blur-lg top-0 left-0 flex justify-center items-center z-20">
      <div className="w-1/2 p-2 bg-zinc-900 rounded-xl flex flex-col justify-between items-center gap-4">
        <div className="w-full justify-between flex border-b-[1px] border-green-500 justify-sart items-center p-2">
          <h1 className="text-xl font-semibold text-white">Add Table</h1>
          <div
            onClick={() => setAddTable(false)}
            className="w-10 h-10 bg-red-600 rounded-full cursor-pointer flex justify-center items-center hover:bg-red-800"
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <div className="w-full flex justify-start items-center">
          <input
            onChange={(e) =>
              setTableFormData({ ...TableFormData, table_name: e.target.value })
            }
            placeholder="Enter Table Name"
            className="w-full bg-zinc-800 rounded-full p-2 text-white"
          />
        </div>
        <div className="w-full flex justify-end items-center">
          <button
            onClick={() => HandleAddTable()}
            className="px-4 py-2 bg-green-600 rounded-full hover:bg-green-800"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
export default Database;
