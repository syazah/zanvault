import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Database/Sidebar";

function Database() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dbname = queryParams.get("dbname");
  return (
    <div className="w-100% h-[100vh] bg-zinc-800">
      <Sidebar db_name={dbname} />
    </div>
  );
}

export default Database;
